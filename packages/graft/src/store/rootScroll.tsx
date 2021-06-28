import React, { PropsWithChildren, useCallback } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { Position } from './draggedOver';

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

/**
 * Resolves the client cursor positions to the one which is relative
 * to the document's (iframe) top-left.
 */
/** @internal */
export function useRealCursorPosition() {
  const { getState } = useRootScrollStoreApi();

  return useCallback(
    (position: Position) => {
      const scrollPos = getState().position;
      return {
        x: position.x + scrollPos.left,
        y: position.y + scrollPos.top,
      };
    },
    [getState]
  );
}
