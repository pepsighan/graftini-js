import produce from 'immer';
import create from 'zustand';
import { WithImmerSetter } from './zustand';

export enum RightSidebarOpenPane {
  QueryBuilder,
  StyleOptions,
}

type UseEditorState = {
  rightSidebarOpenPane: RightSidebarOpenPane;
};

export const useEditorState = create<WithImmerSetter<UseEditorState>>((set) => ({
  rightSidebarOpenPane: RightSidebarOpenPane.StyleOptions,
  set: (fn) => set(produce(fn)),
}));