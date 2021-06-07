import produce from 'immer';
import React, { PropsWithChildren } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { Region } from '../useRegion';

/**
 * Stores the positions of all the components. This is stored separately from the component because
 * this data always changes and it is dependent on the ComponentNode object itself.
 */
/** @internal */
export type ComponentRegionMap = {
  /**
   * The region on the screen that this component occupies. This is automatically updated based on
   * where it renders.
   */
  [componentId: string]: Region;
};

/** @internal */
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
  return <Provider initialStore={createRegionMapStore()}>{children}</Provider>;
}

/** @internal */
export const useComponentRegionStore = useStore;

/** @internal */
export const useComponentRegionStoreApi = useStoreApi;
