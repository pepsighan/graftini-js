import { produce } from 'immer';
import React, { ReactNode, useContext } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { GraftComponent } from '../componentTypes';
import { RootOverrideContext } from '../context';

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
 * The state of the editor which holds the representation of the drawn component in
 * the canvas.
 */
export type EditorStore = {
  /**
   * The representation of the view that is rendered on the canvas.
   */
  componentMap: ComponentMap;
  /**
   * A setter which uses immer.
   */
  immerSet(fn: (state: EditorStore) => void): void;
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

/**
 * The default component map when a new editor is initialized if a component map is not
 * specified.
 */
export function defaultComponentMap(defaultProps?: any): ComponentMap {
  return {
    [ROOT_NODE_ID]: {
      id: ROOT_NODE_ID,
      type: ROOT_NODE_COMPONENT,
      childAppendDirection: 'vertical',
      props: {
        ...(defaultProps ?? {}),
      },
      isCanvas: true,
      parentId: null,
      childrenNodes: [],
    },
  };
}

function createEditorStore(componentMap?: ComponentMap, rootOverride?: GraftComponent<any> | null) {
  const map = componentMap ?? defaultComponentMap(rootOverride?.graftOptions?.defaultProps);

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

  return create<EditorStore>((set) => ({
    componentMap: map,
    immerSet: (fn) => set(produce(fn)),
  }));
}

const { Provider, useStore, useStoreApi } = createContext<EditorStore>();

export const useEditorStore = useStore;

export const useEditorStoreApi = useStoreApi;

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
 * the children by using `useEditorStore`.
 */
/** @internal */
export function EditorStateProvider({ elementMap, children }: EditorStateProviderProps) {
  const RootComponent = useContext(RootOverrideContext);
  return (
    <Provider createStore={() => createEditorStore(elementMap, RootComponent)}>{children}</Provider>
  );
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
