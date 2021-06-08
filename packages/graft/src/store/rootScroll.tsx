import React, { PropsWithChildren } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';

/** @internal */
type RootScrollStore = {
  /**
   * The current position of the scroll of the root component.
   */
  position: {
    top: number;
    left: number;
  };
  /**
   * Whether to enable drag scroll or not.
   */
  enableDragScroll: boolean;
  /**
   * Whether the scroll
   */
  isDragScrolling: boolean;
};

/** @internal */
const createRootScrollStore = () =>
  create<RootScrollStore>(() => ({
    position: { top: 0, left: 0 },
    enableDragScroll: false,
    isDragScrolling: false,
  }));

const { Provider, useStoreApi } = createContext<RootScrollStore>();

/** @internal */
export function RootScrollStoreProvider({ children }: PropsWithChildren<{}>) {
  return <Provider initialStore={createRootScrollStore()}>{children}</Provider>;
}

/** @internal */
export const useRootScrollStoreApi = useStoreApi;
