import produce from 'immer';
import React, { PropsWithChildren } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { Position } from './draggedOver';
import { ChildAppendDirection, ComponentProps } from './editor';

/**
 * The kind of component that is to be created.
 */
export type NewComponent = {
  /**
   * The kind of component to create. This type should be registered with the Editor.
   */
  type: string;
  /**
   * Whether the component is a canvas.
   */
  isCanvas: boolean;
  /**
   * The direction in which the children can be drawn in the canvas.
   */
  childAppendDirection?: ChildAppendDirection;
  /**
   * The default props of the component when drawn. This will override the defaultProps
   * defined by the Graft Options of the component.
   */
  defaultProps?: ComponentProps;
  /**
   * This function transforms the size of the sketch into the props which are then
   * passed to the newly created component.
   * The sizes will be ignored if this function is not specified.
   */
  transformSize?(width: number, height: number): ComponentProps;
  /**
   * A callback that is run after a new component is created.
   */
  onCreate?(componentId: string): void;
};

/**
 * When creating a new component this store tracks the whole process.
 */
export type CreateComponentStore = {
  /**
   * A new component that is to be created when drawn.
   */
  newComponent?: NewComponent | null;
  /**
   * Tracks where the cursor draws a rectangular frame in. The start
   * and end positions of the cursor.
   */
  draw?: {
    start: Position;
    end: Position;
  } | null;
  /**
   * A setter which uses immer.
   */
  immerSet(fn: (state: CreateComponentStore) => void): void;
};

/** @internal */
export const createCreateComponentStore = () =>
  create<CreateComponentStore>((set) => ({
    immerSet: (fn) => set(produce(fn)),
  }));

const { Provider, useStore, useStoreApi } = createContext<CreateComponentStore>();

/** @internal */
export function CreateComponentStoreProvider({ children }: PropsWithChildren<{}>) {
  return <Provider createStore={createCreateComponentStore}>{children}</Provider>;
}

export const useCreateComponentStore = useStore;

export const useCreateComponentStoreApi = useStoreApi;
