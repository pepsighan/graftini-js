import { ComponentMap } from '@graftini/graft';
import produce from 'immer';
import { ReactNode, useCallback, useState } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { ProjectPage } from './projects';

type UseDesignerState = {
  currentOpenPage?: string | null;
  selectedComponentId?: string | null;
  isTextEditingEnabled: boolean; // Only makes sense in case a text component is selected.
  isBoxResizing: boolean;
  pages: {
    [id: string]: ComponentMap;
  };

  selectComponent(componentId: string): void;
  unselectComponent(): void;
  startEditingText(): void;
  setIsBoxResizing(resizing: boolean): void;
  setCurrentPage(pageId: string): void;
  updatePageDesign(pageId: string, componentMap: ComponentMap): void;
  deletePage(pageId: string): void;
};

const createDesignerState = (pages: ProjectPage[]) =>
  create<UseDesignerState>((set) => {
    const immerSet = (fn: (state: UseDesignerState) => void) => set(produce(fn));

    return {
      currentOpenPage: pages.length > 0 ? pages[0].id : null,
      selectedComponentId: null,
      isTextEditingEnabled: false,
      isBoxResizing: false,
      pages: pages.reduce((acc, cur) => {
        acc[cur.id] = parseComponentMap(cur.componentMap);
        return acc;
      }, {}),

      selectComponent(componentId: string) {
        immerSet((state) => {
          // If any other component is selected, disable the editing mode (if it was enabled).
          state.isTextEditingEnabled =
            state.selectedComponentId === componentId ? state.isTextEditingEnabled : false;
          state.selectedComponentId = componentId;
        });
      },
      unselectComponent() {
        immerSet((state) => {
          state.selectedComponentId = null;
          state.isTextEditingEnabled = false;
        });
      },
      startEditingText() {
        immerSet((state) => {
          state.isTextEditingEnabled = true;
        });
      },
      setIsBoxResizing(resizing: boolean) {
        immerSet((state) => {
          state.isBoxResizing = resizing;
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
      deletePage(pageId: string) {
        immerSet((state) => {
          // Remove the page from the store and reset the current open page if
          // it is selected.
          delete state.pages[pageId];
          state.currentOpenPage =
            state.currentOpenPage === pageId ? pages[0].id : state.currentOpenPage;
        });
      },
    };
  });

const { Provider, useStore, useStoreApi } = createContext<UseDesignerState>();

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

export const useDesignerStateApi = useStoreApi;

/**
 * Parse the component map that is received from the backend to the one readable by graft.
 */
export function parseComponentMap(stringified?: string): ComponentMap | null {
  const json = stringified ? JSON.parse(stringified) : null;
  return json;
}

/**
 * Hook to check if dragging is disabled. It may be disabled if there is an ongoing
 * text editing operation or a component is being resized.
 */
export function useIsDraggingDisabled(): boolean {
  return useDesignerState(
    useCallback((state) => state.isTextEditingEnabled || state.isBoxResizing, [])
  );
}
