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
};

type SavedQuery = {
  id: string;
  variableName: string;
  query: {
    [field: string]: boolean;
  };
};

export const useEditorState = create<WithImmerSetter<UseEditorState>>((set) => ({
  rightSidebarOpenPane: RightSidebarOpenPane.StyleOptions,
  savedQueries: [],
  set: (fn) => set(produce(fn)),
}));
