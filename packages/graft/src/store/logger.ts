import { SetState, StateCreator } from 'zustand';

/**
 * Logging middleware for the zustand store.
 */
export function log<T extends object>(
  createState: StateCreator<T, SetState<T>>
): StateCreator<T, SetState<T>> {
  return (set, get, api) =>
    createState(
      (args: any) => {
        set(args);
        console.log(get());
      },
      get,
      api
    );
}
