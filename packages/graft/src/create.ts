import { nanoid } from 'nanoid';
import { MouseEvent, MouseEventHandler, useCallback, useContext } from 'react';
import { addComponentToDropRegion, DropRegion, identifyDropRegion } from './dropLocation';
import { ResolverContext } from './resolver';
import {
  CreateComponentStore,
  NewComponent,
  useCreateComponentStore,
} from './store/createComponent';
import {
  ComponentNode,
  EditorStore,
  useEditorStateInternal,
  useEditorStoreApiInternal,
} from './store/editor';
import { useComponentRegionStoreApi } from './store/regionMap';

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
  const immerSetEditor = useEditorStateInternal(
    useCallback((state: EditorStore) => state.immerSet, [])
  );
  const { getState: getEditorState } = useEditorStoreApiInternal();
  const { getState: getRegionState } = useComponentRegionStoreApi();
  const resolverMap = useContext(ResolverContext);

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
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

  const onMouseUp = useCallback(() => {
    let dropRegion: DropRegion | null = null;
    let newComponent: ComponentNode | null = null;

    // Insert the new component.
    immerSetCreateComponent((state) => {
      if (!state.newComponent || !state.draw) {
        return;
      }

      const Component = resolverMap[state.newComponent.type];
      if (!Component) {
        throw new Error(
          `\`${state.newComponent.type}\` is not registered in the Editor resolvers prop.`
        );
      }

      dropRegion = identifyDropRegion(
        getEditorState().componentMap,
        getRegionState().regionMap,
        state.draw!.start
      );

      newComponent = {
        id: nanoid(),
        type: state.newComponent.type,
        isCanvas: state.newComponent.isCanvas,
        props: {
          ...(Component.graftOptions?.defaultProps ?? {}),
          ...(state.newComponent.defaultProps ?? {}),
          // This are reserved props that the component may use.
          width: state.draw.end.x - state.draw.start.x,
          height: state.draw.end.y - state.draw.start.x,
        },
        childAppendDirection: state.newComponent.childAppendDirection || 'vertical',
        childrenNodes: [],
      };

      state.draw = null;
      state.newComponent = null;
    });

    immerSetEditor((state) => {
      if (!dropRegion) {
        return;
      }

      state.componentMap[newComponent!.id] = newComponent!;
      addComponentToDropRegion(newComponent!.id, dropRegion, state.componentMap);
    });
  }, [getEditorState, getRegionState, immerSetCreateComponent, immerSetEditor, resolverMap]);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}
