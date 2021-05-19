import { ComponentMap } from '@graftini/graft';
import produce from 'immer';
import { ReactNode, useState } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { ProjectPage } from './projects';

export enum RightSidebarOpenPane {
  QueryBuilder,
  StyleOptions,
}

type UseDesignerState = {
  rightSidebarOpenPane: RightSidebarOpenPane;
  currentOpenPage?: string | null;
  selectedComponentId?: string | null;
  pages: {
    [id: string]: ComponentMap;
  };

  selectComponent(componentId: string): void;
  toggleQueryBuilderPane(): void;
  setCurrentPage(pageId: string): void;
  updatePageDesign(pageId: string, componentMap: ComponentMap): void;
};

const createDesignerState = (pages: ProjectPage[]) =>
  create<UseDesignerState>((set) => {
    const immerSet = (fn: (state: UseDesignerState) => void) => set(produce(fn));

    return {
      rightSidebarOpenPane: RightSidebarOpenPane.StyleOptions,
      currentOpenPage: pages.length > 0 ? pages[0].id : null,
      selectedComponentId: null,
      pages: pages.reduce((acc, cur) => {
        acc[cur.id] = parseMarkup(cur.markup);
        return acc;
      }, {}),

      selectComponent(componentId: string) {
        immerSet((state) => {
          state.selectedComponentId = componentId;
        });
      },
      toggleQueryBuilderPane() {
        immerSet((state) => {
          state.rightSidebarOpenPane =
            state.rightSidebarOpenPane === RightSidebarOpenPane.QueryBuilder
              ? RightSidebarOpenPane.StyleOptions
              : RightSidebarOpenPane.QueryBuilder;
        });
      },
      setCurrentPage(pageId: string) {
        immerSet((state) => {
          state.currentOpenPage = pageId;
          state.selectedComponentId = null;
        });
      },
      updatePageDesign(pageId: string, componentMap: ComponentMap) {
        immerSet((state) => {
          state.pages[pageId] = componentMap;
        });
      },
    };
  });

const { Provider, useStore } = createContext<UseDesignerState>();

type DesignerStateProviderProps = {
  initialPages: ProjectPage[];
  children: ReactNode;
};

/**
 * We need the designer state completely clean for each of the project.
 */
export function DesignerStateProvider({ initialPages, children }: DesignerStateProviderProps) {
  const [initialStore] = useState(() => createDesignerState(initialPages));
  return <Provider initialStore={initialStore}>{children}</Provider>;
}

export const useDesignerState = useStore as ReturnType<typeof createDesignerState>;

/**
 * Parse the markup that is received from the backend to the one readable by graft.
 */
export function parseMarkup(markup: string): ComponentMap {
  const json = JSON.parse(markup);
  return json as ComponentMap;
}
