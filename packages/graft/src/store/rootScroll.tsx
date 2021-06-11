import React, { PropsWithChildren } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';

/** @internal */
export type RootScrollStore = {
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
  isDragScrollEnabled: boolean;
};

/** @internal */
const createRootScrollStore = () =>
  create<RootScrollStore>((_) => ({
    position: { top: 0, left: 0 },
    isDragScrollEnabled: false,
  }));

const { Provider, useStore, useStoreApi } = createContext<RootScrollStore>();

/** @internal */
export function RootScrollStoreProvider({ children }: PropsWithChildren<{}>) {
  return <Provider initialStore={createRootScrollStore()}>{children}</Provider>;
}

/** @internal */
export const useRootScrollStore = useStore;

/** @internal */
export const useRootScrollStoreApi = useStoreApi;
