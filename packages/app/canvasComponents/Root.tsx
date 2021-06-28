/** @jsxImportSource @emotion/react */
import { RGBA, rgbaToCss } from '@graftini/bricks';
import { RootComponent, ROOT_NODE_ID, useCurrentCreateComponentType } from '@graftini/graft';
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
  ({ color, children, ...rest }, ref: ForwardedRef<unknown>) => {
    const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
    const currentCreateType = useCurrentCreateComponentType();
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
          css={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            pointerEvents: currentCreateType ? 'none' : null,
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
