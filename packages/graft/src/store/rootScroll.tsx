import React, { PropsWithChildren } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { Position } from './draggedOver';

export type RootScrollStore = {
  /**
   * The current position of the scroll of the root component.
   */
  position: Position;
  /**
   * Whether to enable drag scroll or not.
   */
  isDragScrollEnabled: boolean;
};

/** @internal */
const createRootScrollStore = () =>
  create<RootScrollStore>((_) => ({
    position: { x: 0, y: 0 },
    isDragScrollEnabled: false,
  }));

const { Provider, useStore, useStoreApi } = createContext<RootScrollStore>();

/** @internal */
export function RootScrollStoreProvider({ children }: PropsWithChildren<{}>) {
  return <Provider createStore={createRootScrollStore}>{children}</Provider>;
}

export const useRootScrollStore = useStore;

export const useRootScrollStoreApi = useStoreApi;
