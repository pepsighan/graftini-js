import { MouseEvent, MouseEventHandler, useCallback } from 'react';
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

type UseDrawComponent = {
  onMouseDown: MouseEventHandler;
  onMouseMove: MouseEventHandler;
  onMouseUp: MouseEventHandler;
};

/**
 * Hook that enables drawing a rectangle on a canvas.
 */
export function useDrawComponent(): UseDrawComponent {
  const immerSet = useCreateComponentStore(
    useCallback((state: CreateComponentStore) => state.immerSet, [])
  );

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      immerSet((state) => {
        const position = {
          x: event.clientX,
          y: event.clientY,
        };

        state.draw = {
          start: position,
          end: position,
        };
      });
    },
    [immerSet]
  );

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      immerSet((state) => {
        state.draw!.end.x = event.clientX;
        state.draw!.end.y = event.clientY;
      });
    },
    [immerSet]
  );

  const onMouseUp = useCallback(() => {
    // Insert the new component.
  }, []);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}
