import React, { PropsWithChildren } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';

/** @internal */
type RootScrollStore = {
  top: number;
  left: number;
};

/**
 * A hook that shares the root component's scroll position to the rest of the app.
 */
/** @internal */
const createRootScrollStore = () =>
  create<RootScrollStore>(() => ({
    top: 0,
    left: 0,
  }));

const { Provider, useStoreApi } = createContext<RootScrollStore>();

/** @internal */
export function RootScrollStoreProvider({ children }: PropsWithChildren<{}>) {
  return <Provider initialStore={createRootScrollStore()}>{children}</Provider>;
}

/** @internal */
export const useRootScrollStoreApi = useStoreApi;
