/** @jsxImportSource @emotion/react */
import { RootComponent, useCurrentCreateComponentType } from 'graft';
import { ForwardedRef, forwardRef, useCallback } from 'react';
import { useDesignerState } from 'store/designer';

const Root: RootComponent = forwardRef((props, ref: ForwardedRef<unknown>) => {
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

export default Root;
