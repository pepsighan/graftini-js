import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { StateListener, StateSelector } from 'zustand';
import { Root__Graft__Component } from './canvas';
import { ResolverMap, ResolverProvider } from './resolver';
import {
  ChildAppendDirection,
  ComponentMap,
  ComponentNode,
  ComponentProps,
  EditorStateProvider,
  useEditorStateInternal,
  useEditorStoreApiInternal,
} from './schema';

/**
 * Props for the editor.
 */
export type EditorProps = {
  /**
   * An initial state of the components drawn on the canvas. This is just an initial state.
   * The editor itself manages the internal state. Hence, once initialized it won't update.
   */
  initialState?: ComponentMap;
  /**
   * Resolvers is a map of components which are used to render based on the editor state. All
   * the component names provided in the editor state should be registered here with the same
   * keys. If some component node cannot be rendered in the state, then it will throw error.
   *
   * Also, there is one hard requirement for the components, that they must allow ref. Components
   * without ref will fail.
   */
  resolvers: ResolverMap;
  /**
   * The children of the editor. This can be anything that you can imagine. The only requirement
   * is that it must have a single Canvas component down the tree.
   */
  children: ReactNode;
};

/**
 * An editor which stores the state of the elements drawn in the canvas.
 */
export function Editor({ initialState, resolvers, children }: EditorProps) {
  if (!resolvers) {
    throw new Error(
      '`resolvers` prop on Editor is required. We cannot render anything on canvas if ' +
        'there are no resolvers.'
    );
  }

  return (
    <EditorStateProvider elementMap={initialState}>
      <ResolverProvider value={{ ...resolvers, Root__Graft__Component }}>
        {children}
      </ResolverProvider>
    </EditorStateProvider>
  );
}

/**
 * A subscriber type on the editor state. You may provide an optional selector if only listening
 * to a subset of the state.
 */
interface EditorStateSubscribe {
  (listener: StateListener<ComponentMap>): () => void;
  <StateSlice extends object>(
    listener: StateListener<StateSlice>,
    selector: StateSelector<ComponentMap, StateSlice>
  ): () => void;
}

/**
 * A callback which accepts existing props and expects a new & updated props.
 */
type PropsUpdater = (props: ComponentProps) => ComponentProps;

/**
 * The actions returned by the useEditor hook. All of the values or actions are lazy. They
 * won't be computed unless you call them.
 */
type UseEditor = {
  getState(): ComponentMap;
  subscribe: EditorStateSubscribe;
  getComponentNode(componentId: string): ComponentNode | null;
  updateComponentProps(componentId: string, props: ComponentProps | PropsUpdater): void;
  deleteComponentNode(componentId: string): void;
  setIsCanvas(componentId: string, isCanvas: boolean): void;
  setChildAppendDirection(componentId: string, childAppendDirection: ChildAppendDirection): void;
};

/**
 * Hook to get utilities to access the internal state of the editor. Use this hook
 * within the context of an editor.
 */
export function useEditor(): UseEditor {
  const { getState, subscribe, setState } = useEditorStoreApiInternal();

  const immerSet = useEditorStateInternal(useCallback((state) => state.immerSet, []));

  const getEditorState = useCallback(() => getState().componentMap, [getState]);
  const getComponentNode = useCallback(
    (componentId: string) => getState().componentMap[componentId],
    [getState]
  );

  const subscribeEditorState = useCallback(
    (listener, selector) =>
      subscribe(listener, (state) =>
        selector != null ? selector(state.componentMap) : state.componentMap
      ),
    [subscribe]
  );

  const updateComponentProps = useCallback(
    (componentId: string, props: ComponentProps) => {
      setState((state) => {
        const component = state.componentMap[componentId];

        if (!component) {
          throw new Error(
            `cannot set props for a non-existent component. component with id \`${componentId}\` does not exist.`
          );
        }

        // Merge the props if it is an object type or replace the props if it is a callback.
        const newProps =
          typeof props === 'function' ? props(component.props) : { ...component.props, props };

        return {
          ...state,
          componentMap: {
            ...state.componentMap,
            [componentId]: {
              ...component,
              props: newProps,
            },
          },
        };
      });
    },
    [setState]
  );

  const deleteComponentNode = useCallback(
    (componentId: string) => {
      setState((state) => {
        const component = state.componentMap[componentId];
        if (!component) {
          return state;
        }

        const parent = {
          ...state.componentMap[component.parentId!],
          childrenNodes: state.componentMap[component.parentId!].childrenNodes.filter(
            (it) => it !== component.id
          ),
        };

        const newComponentMap = {
          ...state.componentMap,
          [component.parentId!]: parent,
          [component.id]: {
            ...component,
            // We just mark the component to be deleted.
            // We do this because the canvas may be dependent still
            // on this component until it is destroyed in the next render-cycle.
            isDeleted: true,
          },
        };

        return {
          ...state,
          componentMap: newComponentMap,
        };
      });
    },
    [setState]
  );

  const setIsCanvas = useCallback(
    (componentId: string, isCanvas: boolean) => {
      immerSet((state) => {
        state.componentMap[componentId].isCanvas = isCanvas;
      });
    },
    [immerSet]
  );

  const setChildAppendDirection = useCallback(
    (componentId: string, childAppendDirection: ChildAppendDirection) => {
      immerSet((state) => {
        state.componentMap[componentId].childAppendDirection = childAppendDirection;
      });
    },
    [immerSet]
  );

  return {
    getState: getEditorState,
    subscribe: subscribeEditorState as EditorStateSubscribe,
    getComponentNode,
    updateComponentProps,
    deleteComponentNode,
    setIsCanvas,
    setChildAppendDirection,
  };
}

/**
 * Hook to get the editor state. Pass in an optional selector to limit the state that is returns.
 */
export function useEditorState(): ComponentMap;
export function useEditorState<T extends object>(selector: StateSelector<ComponentMap, T>): T;
export function useEditorState<T extends object>(
  selector?: StateSelector<ComponentMap, T>
): T | ComponentMap {
  const { getState, subscribe } = useEditor();
  const [state, setState] = useState(() => (selector ? selector(getState()) : getState()));

  useEffect(() => {
    return subscribe(
      (state) => {
        setState(state as T | ComponentMap);
      },
      selector ? selector : (state) => state
    );
  }, [selector, subscribe]);

  return state;
}

export type DragState = {
  isDragging: boolean;
  componentId?: string | null;
};

/**
 * Hook to see whether a component is being dragged right now.
 */
export function useDragState(): DragState {
  return useEditorStateInternal<DragState>(
    useCallback(
      (state) => ({
        isDragging: state.draggedOver.isDragging,
        componentId: state.draggedOver.component?.id,
      }),
      []
    ),
    useCallback(
      (left: DragState, right: DragState) =>
        left.isDragging === right.isDragging && left.componentId === right.componentId,
      []
    )
  );
}
