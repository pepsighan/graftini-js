import produce from 'immer';
import React, { PropsWithChildren } from 'react';
import create, { StateListener } from 'zustand';
import createContext from 'zustand/context';
import { HoverRegion } from '../hover';
import { Position } from './draggedOver';

/**
 * Stores the current position of the cursor when hovering.
 */
export type HoverStore = {
  /**
   * The current position of the cursor that is corrected depending on if it
   * is on the root.
   */
  cursorPosition?: Position | null;
  /**
   * The current component & its region that is being hovered over. The position
   * is relative to the document (i.e. the iframe).
   */
  hoverRegion?: HoverRegion | null;
  /**
   * Whether the cursor in on the iframe.
   */
  isOnIFrame?: boolean;
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

export const useHoverStore = useStore;

export const useHoverStoreApi = useStoreApi;
