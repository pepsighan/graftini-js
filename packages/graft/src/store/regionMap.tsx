import produce from 'immer';
import React, { PropsWithChildren } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { Region } from '../useRegion';

/**
 * Stores the positions of all the components. This is stored separately from the component because
 * this data always changes and it is dependent on the ComponentNode object itself.
 */
export type ComponentRegionMap = {
  /**
   * The region on the screen that this component occupies. This is automatically updated based on
   * where it renders. The position is relative to the parent document (i.e. the iframe).
   */
  [componentId: string]: Region;
};

export type ComponentRegionStore = {
  regionMap: ComponentRegionMap;
  /**
   * A setter which uses immer.
   */
  immerSet(fn: (state: ComponentRegionStore) => void): void;
};

/** @internal */
export const createRegionMapStore = () =>
  create<ComponentRegionStore>((set) => ({
    regionMap: {},
    immerSet: (fn) => set(produce(fn)),
  }));

const { Provider, useStore, useStoreApi } = createContext<ComponentRegionStore>();

/** @internal */
export function ComponentRegionStateProvider({ children }: PropsWithChildren<{}>) {
  return <Provider createStore={createRegionMapStore}>{children}</Provider>;
}

export const useComponentRegionStore = useStore;

export const useComponentRegionStoreApi = useStoreApi;
