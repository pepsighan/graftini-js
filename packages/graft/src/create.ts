import { nanoid } from 'nanoid';
import { MouseEvent, MouseEventHandler, useCallback, useContext } from 'react';
import { addComponentToDropRegion, DropRegion, identifyDropRegion } from './dropLocation';
import { ResolverContext, ResolverMap } from './resolver';
import {
  CreateComponentStore,
  NewComponent,
  useCreateComponentStore,
} from './store/createComponent';
import { ComponentNode, EditorStore, useEditorStore, useEditorStoreApi } from './store/editor';
import { useComponentRegionStoreApi } from './store/regionMap';
import { useRootScrollStoreApi } from './store/rootScroll';

/**
 * Read the paper around why we are using a draw method to create components.
 * https://www.notion.so/Drawing-new-components-onto-a-canvas-a90d18a74f014aea8c2c76b42d90aedb
 */

type CreateComponent = () => void;

/**
 * Hook that registers a new component that can be created when drawn on the
 * canvas.
 */
export function useCreateComponent(config: NewComponent): CreateComponent {
  const immerSet = useCreateComponentStore(
    useCallback((state: CreateComponentStore) => state.immerSet, [])
  );

  return useCallback(() => {
    immerSet((state) => {
      state.newComponent = config;
    });
  }, [config, immerSet]);
}

type ForgetCreateComponent = () => void;

/**
 * Hook that allows you to forget the create component action.
 */
export function useForgetCreateComponent(): ForgetCreateComponent {
  const immerSet = useCreateComponentStore(
    useCallback((state: CreateComponentStore) => state.immerSet, [])
  );

  return useCallback(() => {
    immerSet((state) => {
      state.newComponent = null;
    });
  }, [immerSet]);
}

type UseDrawComponent = {
  onMouseDown: MouseEventHandler;
  onMouseMove: MouseEventHandler;
  onMouseUp: MouseEventHandler;
};

/**
 * Hook that enables drawing a rectangle on a canvas.
 */
/** @internal */
export function useDrawComponent(): UseDrawComponent {
  const immerSetCreateComponent = useCreateComponentStore(
    useCallback((state: CreateComponentStore) => state.immerSet, [])
  );
  const immerSetEditor = useEditorStore(useCallback((state: EditorStore) => state.immerSet, []));
  const { getState: getEditorState } = useEditorStoreApi();
  const { getState: getRegionState } = useComponentRegionStoreApi();
  const resolverMap = useContext(ResolverContext);
  const { getState: getRootScrollState } = useRootScrollStoreApi();

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      if (event.buttons !== 1) {
        // If drawing does not start with the left mouse click, ignore it.
        return;
      }

      immerSetCreateComponent((state) => {
        if (!state.newComponent) {
          return;
        }

        const position = {
          x: event.clientX,
          y: event.clientY,
        };

        state.draw = {
          start: position,
          end: position,
        };
      });
    },
    [immerSetCreateComponent]
  );

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      // Calculate the end point of the sketch that is being drawn.
      immerSetCreateComponent((state) => {
        if (!state.draw) {
          // Do not track if not drawing.
          return;
        }

        // Do not let in draw in the inverse region.
        state.draw.end.x = event.clientX < state.draw.start.x ? state.draw.start.x : event.clientX;
        state.draw.end.y = event.clientY < state.draw.start.y ? state.draw.start.y : event.clientY;
      });
    },
    [immerSetCreateComponent]
  );

  const onMouseUp = useCallback(
    (event: MouseEvent) => {
      let dropRegion: DropRegion | null = null;
      let newComponent: ComponentNode | null = null;
      const childrenComponents: ComponentNode[] = [];
      let afterCreate: any = null;

      // Insert the new component.
      immerSetCreateComponent((state) => {
        if (!state.newComponent || !state.draw) {
          return;
        }

        // Use the final values for the cursor.
        // Do not let in draw in the inverse region.
        state.draw.end.x = event.clientX < state.draw.start.x ? state.draw.start.x : event.clientX;
        state.draw.end.y = event.clientY < state.draw.start.y ? state.draw.start.y : event.clientY;

        // The draw might be happening at a position where the canvas is scrolled.
        const scrollPosition = getRootScrollState().position;
        const resolvedStartPosition = {
          x: state.draw!.start.x + scrollPosition.x,
          y: state.draw!.start.y + scrollPosition.y,
        };

        dropRegion = identifyDropRegion(
          getEditorState().componentMap,
          getRegionState().regionMap,
          resolvedStartPosition
        );

        afterCreate = state.newComponent.onCreate;
        const transformSize = state.newComponent.transformSize;

        const width = state.draw.end.x - state.draw.start.x;
        const height = state.draw.end.y - state.draw.start.y;
        const transformedSize = transformSize?.(width, height);

        newComponent = newComponentNode(
          resolverMap,
          state.newComponent,
          transformedSize,
          childrenComponents,
          null
        );

        state.draw = null;
        state.newComponent = null;
      });

      immerSetEditor((state) => {
        if (!dropRegion) {
          return;
        }

        state.componentMap[newComponent!.id] = newComponent!;
        childrenComponents.forEach((it) => {
          state.componentMap[it.id] = it;
        });

        addComponentToDropRegion(newComponent!.id, dropRegion, state.componentMap);
      });

      if (dropRegion && afterCreate) {
        afterCreate(newComponent!.id);
      }
    },
    [
      getEditorState,
      getRegionState,
      getRootScrollState,
      immerSetCreateComponent,
      immerSetEditor,
      resolverMap,
    ]
  );

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}

/**
 * Creates a new component node with the given config options. In case of complex components
 * all the nested children components will be filled within [childrenComponents] argument.
 */
export function newComponentNode(
  resolverMap: ResolverMap,
  component: NewComponent,
  transformedSize: any,
  childrenComponents: ComponentNode[],
  parentId: string | null
): ComponentNode {
  const Component = resolverMap[component.type];
  if (!Component) {
    throw new Error(`\`${component.type}\` is not registered in the Editor resolvers prop.`);
  }

  if (component.variant === 'basic') {
    return {
      id: nanoid(),
      type: component.type,
      isCanvas: component.isCanvas,
      props: {
        ...(Component.graftOptions?.defaultProps ?? {}),
        ...(component.defaultProps ?? {}),
        ...(transformedSize ?? {}),
      },
      childAppendDirection: component.childAppendDirection || 'vertical',
      childrenNodes: [],
    };
  }

  // The component is a complex one. So we will need to create all the nested components
  // as well and attach them to its parent.

  const id = nanoid();
  const { childrenNodes, ...restProps } = component.defaultProps ?? {};

  // Create all the children nodes and attach them to the parent.
  const nodes = (childrenNodes ?? []).map((it: NewComponent) =>
    newComponentNode(resolverMap, it, null, childrenComponents, id)
  );
  childrenComponents.push(...nodes);

  return {
    id,
    type: component.type,
    isCanvas: component.isCanvas,
    props: {
      ...(Component.graftOptions?.defaultProps ?? {}),
      ...restProps,
      ...(transformedSize ?? {}),
    },
    childAppendDirection: component.childAppendDirection || 'vertical',
    childrenNodes: nodes.map((it: ComponentNode) => it.id),
    parentId,
  };
}
