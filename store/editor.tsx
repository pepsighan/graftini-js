import { ComponentMap } from '@graftini/graft';
import produce from 'immer';
import { ReactNode, useState } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { ProjectPage } from './projects';
import { WithImmerSetter } from './zustand';

// TODO: Rename this store to something else. Graft already uses editor to mean the designer.

export enum RightSidebarOpenPane {
  QueryBuilder,
  StyleOptions,
}

type UseEditorState = {
  rightSidebarOpenPane: RightSidebarOpenPane;
  currentOpenPage?: string;
  pages: {
    [id: string]: ComponentMap;
  };
};

export const rootComponentId = 'ROOT';

const createEditorState = (pages: ProjectPage[]) =>
  create<WithImmerSetter<UseEditorState>>((set) => ({
    rightSidebarOpenPane: RightSidebarOpenPane.StyleOptions,
    currentOpenPage: pages.length > 0 ? pages[0].id : null,
    pages: pages.reduce((acc, cur) => {
      acc[cur.id] = parseMarkup(cur.markup);
      return acc;
    }, {}),
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

/**
 * Parse the markup that is received from the backend to the one readable by graft.
 */
export function parseMarkup(markup: string): ComponentMap {
  const json = JSON.parse(markup);
  return json as ComponentMap;
}
