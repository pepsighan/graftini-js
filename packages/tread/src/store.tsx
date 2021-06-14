import React, { PropsWithChildren } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';

/** @internal */
export type TreeStore = {
  /** Whether a sub-tree is collapsed or not.  */
  isSubTreeCollapsed: {
    [key: string]: boolean;
  };
  toggleCollapse(id: string): void;
};

/** @internal */
export const createTreeStore = () =>
  create<TreeStore>((set) => ({
    isSubTreeCollapsed: {},
    toggleCollapse(id: string) {
      set((state) => ({
        ...state,
        isSubTreeCollapsed: {
          ...state.isSubTreeCollapsed,
          [id]: !state.isSubTreeCollapsed[id],
        },
      }));
    },
  }));

const { Provider, useStore } = createContext<TreeStore>();

/** @internal */
export function TreeStoreProvider({ children }: PropsWithChildren<{}>) {
  return <Provider initialStore={createTreeStore()}>{children}</Provider>;
}

/** @internal */
export const useTreeStore = useStore;
