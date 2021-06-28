import produce from 'immer';
import React, { PropsWithChildren, useCallback } from 'react';
import create, { StateListener } from 'zustand';
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
   * where it renders. The position is relative to the parent document (i.e. the iframe).
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

export type UseComponentRegion = {
  get(): Region | null;
  subscribe(listener: StateListener<Region | null | undefined>): () => void;
};

/**
 * Hook that returns a subscriber that can be imperatively subscribed to listen to a component's region.
 */
export function useComponentRegion(componentId: string): UseComponentRegion {
  const { subscribe, getState } = useComponentRegionStoreApi();

  const get = useCallback(() => getState().regionMap[componentId], [componentId, getState]);

  const subscribeComponent = useCallback(
    (listener) =>
      subscribe(
        (region: Region | null, previousRegion: Region | null) => listener(region, previousRegion),
        (state) => state.regionMap[componentId]
      ),
    [componentId, subscribe]
  );

  return { get, subscribe: subscribeComponent };
}
