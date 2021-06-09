import produce from 'immer';
import React, { PropsWithChildren } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { Position } from './draggedOver';

/**
 * Stores the current position of the cursor when hovering.
 */
/** @internal */
export type HoverStore = {
  /**
   * The current position of the cursor when hovering over the canvas.
   */
  hover?: Position | null;
  /**
   * A setter which uses immer.
   */
  immerSet(fn: (state: HoverStore) => void): void;
};

/** @internal */
export const createHoverStore = () =>
  create<HoverStore>((set) => ({
    immerSet: (fn) => set(produce(fn)),
  }));

const { Provider, useStore, useStoreApi } = createContext<HoverStore>();

/** @internal */
export function HoverStoreProvider({ children }: PropsWithChildren<{}>) {
  return <Provider initialStore={createHoverStore()}>{children}</Provider>;
}

/** @internal */
export const useHoverStore = useStore;

/** @internal */
export const useHoverStoreApi = useStoreApi;
