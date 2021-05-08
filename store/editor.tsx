import { SerializedNodes } from '@craftjs/core';
import produce from 'immer';
import { ReactNode, useState } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { ProjectPage } from './projects';
import { WithImmerSetter } from './zustand';

export enum RightSidebarOpenPane {
  QueryBuilder,
  StyleOptions,
}

type UseEditorState = {
  rightSidebarOpenPane: RightSidebarOpenPane;
  pages: EditorPage[];
};

type EditorPage = {
  id: string;
  markup: SerializedNodes;
};

export const rootComponentId = 'ROOT';

const createEditorState = (pages: ProjectPage[]) =>
  create<WithImmerSetter<UseEditorState>>((set) => ({
    rightSidebarOpenPane: RightSidebarOpenPane.StyleOptions,
    pages: pages.map((it) => ({
      id: it.id,
      markup: parseMarkup(it.markup),
    })),
    set: (fn) => set(produce(fn)),
  }));

const { Provider, useStore } = createContext<WithImmerSetter<UseEditorState>>();

type EditorStateProviderProps = {
  initialPages: ProjectPage[];
  children: ReactNode;
};

/**
 * We need the editor state completely clean for each of the project.
 */
export function EditorStateProvider({ initialPages, children }: EditorStateProviderProps) {
  const [initialStore] = useState(() => createEditorState(initialPages));
  return <Provider initialStore={initialStore}>{children}</Provider>;
}

export const useEditorState = useStore as ReturnType<typeof createEditorState>;

export function parseMarkup(markup: string): SerializedNodes {
  return {};
}
