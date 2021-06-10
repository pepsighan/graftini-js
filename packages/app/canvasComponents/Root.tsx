/** @jsxImportSource @emotion/react */
import { RGBA } from 'bricks';
import { RootComponent, ROOT_NODE_ID, useCurrentCreateComponentType } from 'graft';
import { ForwardedRef, forwardRef, useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export type RootProps = {
  color: RGBA;
};

const Root: RootComponent<RootProps> = forwardRef((props, ref: ForwardedRef<unknown>) => {
  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
  const currentCreateType = useCurrentCreateComponentType();

  const onSelect = useCallback(() => {
    selectComponent(ROOT_NODE_ID);
  }, [selectComponent]);

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
      onClick={onSelect}
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
