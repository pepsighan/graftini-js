import produce from 'immer';
import React, { PropsWithChildren } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { ComponentMap } from './editor';

/**
 * Stores the history of the editor.
 */
/** @internal */
export type HistoryStore = {
  /**
   * The current index that in the stack which is shown on the editor.
   */
  index: number;
  /**
   * A stack of the editor history.
   */
  stack: ComponentMap[];
  /**
   * Add a new item to the stack.
   */
  addToStack(map: ComponentMap): void;
  /**
   * Undo the history stack if it can.
   */
  undo(): ComponentMap | null;
  /**
   * Redo the history stack if it can.
   */
  redo(): ComponentMap | null;
};

/** @internal */
export const createHistoryStore = () =>
  create<HistoryStore>((set) => {
    const immerSet = (fn: (state: HistoryStore) => void) => set(produce(fn));

    return {
      index: -1,
      stack: [],
      addToStack(map) {
        immerSet((state) => {
          // Remove all the items from the index till the last and add the new item.
          const newStack = state.stack.splice(
            state.index + 1,
            state.stack.length - state.index - 1,
            map
          );
          state.stack = [...newStack];
        });
      },
      undo() {
        let item: ComponentMap | null = null;

        immerSet((state) => {
          if (state.index > 0) {
            state.index -= 1;
          }

          item = state.stack[state.index];
        });

        return item;
      },
      redo() {
        let item: ComponentMap | null = null;

        immerSet((state) => {
          if (state.index < state.stack.length - 1) {
            state.index += 1;
          }

          item = state.stack[state.index];
        });

        return item;
      },
    };
  });

const { Provider, useStore, useStoreApi } = createContext<HistoryStore>();

/** @internal */
export function HistoryStoreProvider({ children }: PropsWithChildren<{}>) {
  return <Provider initialStore={createHistoryStore()}>{children}</Provider>;
}

/** @internal */
export const useHistoryStore = useStore;

/** @internal */
export const useHistoryStoreApi = useStoreApi;
