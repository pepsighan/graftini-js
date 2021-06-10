/** @jsxImportSource @emotion/react */
import { RGBA } from 'bricks';
import { RootComponent, useCurrentCreateComponentType } from 'graft';
import { ForwardedRef, forwardRef, useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export type RootProps = {
  color: RGBA;
};

const Root: RootComponent<RootProps> = forwardRef((props, ref: ForwardedRef<unknown>) => {
  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));
  const currentCreateType = useCurrentCreateComponentType();

  return (
    <div
      ref={ref as any}
      css={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        cursor: currentCreateType === 'Text' ? 'text' : 'auto',
      }}
      {...props}
      onClick={unselectComponent}
    />
  );
});

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
