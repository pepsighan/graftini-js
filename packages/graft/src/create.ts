import { MouseEventHandler, useCallback } from 'react';
import {
  CreateComponentStore,
  NewComponent,
  useCreateComponentStore,
} from './store/createComponent';

type UseCreateComponent = {
  onClick: MouseEventHandler;
};

/**
 * Hook that returns an event handler to register a component that can be created
 * when drawn on the canvas.
 */
export function useCreateComponent(config: NewComponent): UseCreateComponent {
  const immerSet = useCreateComponentStore(
    useCallback((state: CreateComponentStore) => state.immerSet, [])
  );

  const onClick = useCallback(() => {
    immerSet((state) => {
      state.newComponent = config;
    });
  }, [config, immerSet]);

  return { onClick };
}
