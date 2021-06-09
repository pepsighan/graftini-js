import produce from 'immer';
import React, { PropsWithChildren } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { Region } from '../useRegion';
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
};

/**
 * When creating a new component this store tracks the whole process.
 */
/** @internal */
export type CreateComponentStore = {
  /**
   * A new component that is to be created when drawn.
   */
  newComponent?: NewComponent;
  /**
   * The region in which the new component is created.
   */
  region?: Region;
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
  return <Provider initialStore={createCreateComponentStore()}>{children}</Provider>;
}

/** @internal */
export const useCreateComponentStore = useStore;

/** @internal */
export const useCreateComponentStoreApi = useStoreApi;
