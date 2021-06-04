import React, { ReactNode, useState } from 'react';
import create, { EqualityChecker, StateSelector } from 'zustand';
import createContext from 'zustand/context';
import { produce } from 'immer';

export type ComponentProps = {
  [key: string]: any;
};

/**
 * A single component node that can be dragged and dropped within a canvas.
 */
export type ComponentNode = {
  /**
   * A unique ID for the component.
   */
  id: string;
  /**
   * The type of the component that is used to create this node. This is registered with
   * the editor as a resolver.
   */
  type: string;
  /**
   * The properties of the component defined by the user.
   */
  props: ComponentProps;
  /**
   * If this component node can draw other components within.
   */
  isCanvas: boolean;
  /**
   * The id of the parent within which this component lies. It is null only for the ROOT or a new
   * component that is yet to be dropped.
   */
  parentId?: string | null;
  /**
   * If this component is also a canvas, then this is the place were the IDs of the children nodes
   * are stored.
   */
  childrenNodes: string[];
  /**
   * In what way to append the children of this component. This is only valid if this component is a
   * canvas. This is useful to show the drop marker accordingly.
   */
  childAppendDirection?: ChildAppendDirection;
  /**
   * Whether the component node is no longer present in the tree. This is a remnant that is stored
   * temporarily so that the canvas does not error (because the component may yet not have been
   * destroyed). Call `cleanupComponentMap` function to remove the deleted nodes manually before using
   * the component for something else.
   */
  isDeleted?: boolean;
};

/**
 * The direction in which to append a child in the canvas. This is useful to show the drop marker
 * accordingly.
 */
export type ChildAppendDirection = 'horizontal' | 'vertical';

/**
 * A map of components where the key is a unique id. The following type defines the relationship
 * between each component and where they appear in the tree.
 */
export type ComponentMap = {
  [id: string]: ComponentNode;
};

/**
 * Values related to a dragging action.
 */
/** @internal */
export type DraggedOver = {
  /**
   * Whether a component is being dragged.
   */
  isDragging: boolean;
  /**
   * Whether a component is being dragged and the cursor is on canvas.
   */
  isDraggingOnCanvas?: boolean;
  /**
   * The position of the cursor when dragging.
   */
  cursorPosition?: Position | null;
  /**
   * What kind of component is being dragged new or existing.
   */
  componentKind?: 'new' | 'existing' | null;
  /**
   * The currently dragged component. This has value when isDragging is true.
   */
  component?: ComponentNode | null;
  /**
   * The properties of the components that are hovered over when dragging.
   */
  hoveredOver?: {
    /**
     * The id of the canvas where the component is being dragged over. This is the nearest canvas to the
     * dragged cursor.
     */
    canvasId: string;
    /**
     * The sibling over which the component is being dragged over. The dragged component is to be placed
     * after this sibling. If it a sibling is not hovered over then the component is appended as a child
     * of the canvas.
     */
    siblingId?: string | null;
    /**
     * The dimensions of the canvas or a sibling that is hovered over while dragging a component.
     */
    dimensions: Dimensions;
    /**
     * The dimensions of the last child for the cases where a canvas is being hovered over.
     */
    lastChildDimensions?: Dimensions | null;
    /**
     * Whether the component is a canvas that is being hovered over.
     */
    isCanvas: boolean;
  } | null;
  /**
   * For an existing component that is dragged, this stores its previous location in the canvas.
   * This is useful when the drag action is to be ignored.
   */
  previousLocation?: {
    /**
     * The previous parent of the component.
     */
    parentId: string;
    /**
     * The previous index of the component within the parent's children nodes.
     */
    index: number;
  };
};

/**
 * The dimensions of the component.
 */
/** @internal */
type Dimensions = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

/**
 * The position on the screen.
 */
export type Position = {
  x: number;
  y: number;
};

/**
 * The state of the editor which holds the representation of the drawn component in
 * the canvas.
 */
/** @internal */
export type EditorState = {
  /**
   * The representation of the view that is rendered on the canvas.
   */
  componentMap: ComponentMap;
  /**
   * Whenever a component is dragged the following properties is set to signify the location of the
   * cursor relative to the other components in the canvas.
   */
  draggedOver: DraggedOver;
  /**
   * A setter which uses immer.
   */
  immerSet(fn: (state: EditorState) => void): void;
};

/**
 * The ID of the root node. This node is not represented in the UI and is used as the starting point
 * of every other component nodes. The main purpose of this is to allow multiple component nodes in the
 * root.
 */
export const ROOT_NODE_ID = 'ROOT';

/**
 * The component type that the ROOT node represents. It does not render anything other than the children
 * nodes it has.
 */
/** @internal */
export const ROOT_NODE_COMPONENT = 'Root__Graft__Component';

function createEditorState(componentMap?: ComponentMap) {
  const map = componentMap ?? {
    [ROOT_NODE_ID]: {
      id: ROOT_NODE_ID,
      type: ROOT_NODE_COMPONENT,
      childAppendDirection: 'vertical',
      props: {},
      isCanvas: true,
      parentId: null,
      childrenNodes: [],
    },
  };

  if (map[ROOT_NODE_ID]?.id !== ROOT_NODE_ID) {
    throw new Error(
      'A component map needs to have a ROOT node. A ROOT node is the starting point of the' +
        'components drawn on the canvas.'
    );
  }

  if (map[ROOT_NODE_ID]?.type !== ROOT_NODE_COMPONENT) {
    throw new Error(
      'A ROOT node must have ROOT_NODE_COMPONENT as its component type. This component does not ' +
        'render anything else other than the children of the ROOT node.'
    );
  }

  return create<EditorState>((set) => ({
    componentMap: map,
    draggedOver: {
      isDragging: false,
    },
    immerSet: (fn) => set(produce(fn)),
  }));
}

const { Provider, useStore, useStoreApi } = createContext<EditorState>();

interface UseEditorStore {
  (): EditorState;
  <U>(selector: StateSelector<EditorState, U>, equalityFn?: EqualityChecker<U>): U;
}

/**
 * Hook to get the editor state. Pass a selector if you just want to get a subsection of
 * the state.
 */
/** @internal */
export const useEditorStateInternal = useStore as UseEditorStore;

/**
 * Hook to get the APIs directly on the store.
 */
/** @internal */
export const useEditorStoreApiInternal = useStoreApi;

/**
 * The props for editor state provider.
 */
/** @internal */
type EditorStateProviderProps = {
  elementMap?: ComponentMap;
  children: ReactNode;
};

/**
 * A provider to add the editor state to the context. The editor state is accessible within
 * the children by using `useEditorState`.
 */
/** @internal */
export function EditorStateProvider({ elementMap, children }: EditorStateProviderProps) {
  const [store] = useState(() => createEditorState(elementMap));
  return <Provider initialStore={store}>{children}</Provider>;
}

/**
 * Removes all the deleted component nodes from the map.
 */
export function cleanupComponentMap(componentMap: ComponentMap): ComponentMap {
  Object.keys(componentMap).forEach((key) => {
    if (componentMap[key].isDeleted) {
      delete componentMap[key];
    }
  });

  return componentMap;
}

/**
 * Checks whether a component is within the tree of another component. If both the components are same,
 * then also it holds true.
 */
export function isComponentWithinSubTree(
  subtreeComponentId: string,
  componentId: string,
  componentMap: ComponentMap
): boolean {
  if (subtreeComponentId === componentId) {
    return true;
  }

  const parentId = componentMap[componentId].parentId;
  if (!parentId) {
    return false;
  }

  return isComponentWithinSubTree(subtreeComponentId, parentId, componentMap);
}
