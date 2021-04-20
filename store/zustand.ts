import { useCallback } from 'react';
import { UseStore } from 'zustand';

type ImmerSetterCallback<T> = (state: T) => void;
type ImmerSetter<T> = (fn: ImmerSetterCallback<T>) => void;

/**
 * A type which augments the zustand store type with a setter that is mutated
 * using immer.
 */
export type WithImmerSetter<T> = T & {
  /**
   * This method accepts a callback which itself accepts the store state that can
   * be directly mutated and immer will handle the rest.
   */
  set: ImmerSetter<T>;
};

/**
 * Gets the immer setter for any given zustand store hook.
 *
 * @param useHook A store hook created using zustand.
 */
export function useImmerSetter<T>(useHook: UseStore<WithImmerSetter<T>>): ImmerSetter<T> {
  return useHook(useCallback((state) => state.set, []));
}
