import { SerializedNodes } from '@craftjs/core';
import produce from 'immer';
import create from 'zustand';
import { WithImmerSetter } from './zustand';

export enum RightSidebarOpenPane {
  QueryBuilder,
  StyleOptions,
}

type UseEditorState = {
  rightSidebarOpenPane: RightSidebarOpenPane;
  savedQueries: SavedQuery[];
  markup: SerializedNodes;
};

type SavedQuery = {
  id: string;
  variableName: string;
  query: {
    [field: string]: boolean;
  };
};

export const rootComponentId = 'ROOT';

export const useEditorState = create<WithImmerSetter<UseEditorState>>((set) => ({
  rightSidebarOpenPane: RightSidebarOpenPane.StyleOptions,
  savedQueries: [],
  markup: {
    [rootComponentId]: {
      type: {
        resolvedName: 'Root',
      },
      isCanvas: true,
      props: {
        backgroundColor: {
          r: 255,
          g: 255,
          b: 255,
          a: 1,
        },
      },
      displayName: 'pe',
      custom: {},
      hidden: false,
      nodes: [],
      linkedNodes: {},
    } as any,
  },
  set: (fn) => set(produce(fn)),
}));
