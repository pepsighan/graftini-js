/** @jsxImportSource @emotion/react */
import { RGBA, rgbaToCss } from '@graftini/bricks';
import { RootComponent, ROOT_NODE_ID, useCreateComponentStore } from '@graftini/graft';
import { ForwardedRef, forwardRef, useCallback } from 'react';
import { useCanvasClickTrigger } from 'store/canvasClickTrigger';
import { useDesignerState } from 'store/designer';

const cursor = {
  Text: 'text',
  Box: 'crosshair',
};

export type RootProps = {
  color: RGBA;
};

const Root: RootComponent<RootProps> = forwardRef(
  ({ color, children, onScroll, ...rest }, ref: ForwardedRef<unknown>) => {
    const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
    const currentCreateType = useCreateComponentStore(
      useCallback((state) => state.newComponent?.type, [])
    );
    const triggerClick = useCanvasClickTrigger(useCallback((state: any) => state.trigger, []));

    const onSelect = useCallback(() => {
      selectComponent(ROOT_NODE_ID);
      triggerClick();
    }, [selectComponent, triggerClick]);

    return (
      <div
        css={{
          width: '100%',
          height: '100%',
          cursor: cursor[currentCreateType] ?? 'auto',
          backgroundColor: rgbaToCss(color),
        }}
        {...rest}
        onClick={onSelect}
      >
        <div
          ref={ref as any}
          onScroll={onScroll}
          css={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            pointerEvents: currentCreateType ? 'none' : null,
            // Hide scrollbars on all browsers.
            // https://stackoverflow.com/a/49278385
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              width: 0,
              height: 0,
            },
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

Root.graftOptions = {
  defaultProps: {
    color: {
      r: 255,
      g: 255,
      b: 255,
    },
  },
};

export default Root;
