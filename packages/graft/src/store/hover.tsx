import produce from 'immer';
import React, { PropsWithChildren } from 'react';
import create, { StateListener } from 'zustand';
import createContext from 'zustand/context';
import { HoverRegion } from '../hover';
import { Position } from './draggedOver';

/**
 * Stores the current position of the cursor when hovering.
 */
/** @internal */
export type HoverStore = {
  /**
   * The current position of the cursor that is corrected depending on if it
   * is on the root.
   */
  cursorPosition?: Position | null;
  /**
   * The current component that is being hovered over.
   */
  hoverRegion?: HoverRegion | null;
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

export type UseHoverSubscriber = (
  listener: StateListener<HoverRegion | null | undefined>
) => () => void;

/**
 * Hook that returns a subscriber that can be imperatively subscribed to listen to hover states.
 */
export function useHoverSubscriber(): UseHoverSubscriber {
  const { subscribe } = useHoverStoreApi();
  return (listener) =>
    subscribe((state, previousState) => listener(state.hoverRegion, previousState.hoverRegion));
}
