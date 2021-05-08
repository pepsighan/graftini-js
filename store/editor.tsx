import { SerializedNodes } from '@craftjs/core';
import produce from 'immer';
import { useState } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
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

const createEditorState = (markup: SerializedNodes) =>
  create<WithImmerSetter<UseEditorState>>((set) => ({
    rightSidebarOpenPane: RightSidebarOpenPane.StyleOptions,
    savedQueries: [],
    markup,
    set: (fn) => set(produce(fn)),
  }));

const { Provider, useStore } = createContext();

/**
 * We need the editor state completely clean for each of the project.
 */
export function EditorStateProvider({ initialMarkup, children }) {
  const [initialStore] = useState(() => createEditorState(initialMarkup));
  return <Provider initialStore={initialStore}>{children}</Provider>;
}

export const useEditorState = useStore;
