import produce from 'immer';
import React, { PropsWithChildren } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { DropRegion } from '../dropLocation';
import { ComponentNode } from './editor';

/**
 * The position on the screen.
 */
export type Position = {
  x: number;
  y: number;
};

/**
 * Values related to a dragging action.
 */
/** @internal */
export type DraggedOver = {
  /**
   * Whether a component is being dragged.
   */
  isDragging: boolean;
  /**
   * Whether the cursor in on the iframe.
   */
  isOnIFrame?: boolean;
  /**
   * The position of the cursor when dragging.
   */
  cursorPosition?: Position | null;
  /**
   * The currently dragged component. This has value when isDragging is true.
   */
  component?: ComponentNode | null;
  /**
   * The region where the component is going to be dropped if the drag action ends.
   */
  dropRegion?: DropRegion | null;
};

/** @internal */
export type DraggedOverStore = {
  /**
   * Whenever a component is dragged the following properties is set to signify the location of the
   * cursor relative to the other components in the canvas.
   */
  draggedOver: DraggedOver;
  /**
   * A setter which uses immer.
   */
  immerSet(fn: (state: DraggedOverStore) => void): void;
};

/** @internal */
export const createDraggedOverStore = () =>
  create<DraggedOverStore>((set) => ({
    draggedOver: { isDragging: false },
    immerSet: (fn) => set(produce(fn)),
  }));

const { Provider, useStore, useStoreApi } = createContext<DraggedOverStore>();

/** @internal */
export function DraggedOverStoreProvider({ children }: PropsWithChildren<{}>) {
  return <Provider initialStore={createDraggedOverStore()}>{children}</Provider>;
}

export const useDraggedOverStore = useStore;

export const useDraggedOverStoreApi = useStoreApi;
