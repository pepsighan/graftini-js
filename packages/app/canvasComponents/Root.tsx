/** @jsxImportSource @emotion/react */
import { RGBA, rgbaToCss } from '@graftini/bricks';
import { RootComponent, ROOT_NODE_ID, useCreateComponentStore } from '@graftini/graft';
import { useContextMenu } from 'components/editor/ContextMenu';
import { ForwardedRef, forwardRef, MouseEvent, useCallback } from 'react';
import { useDesignerState } from 'store/designer';

const cursor = {
  Text: 'text',
  Box: 'crosshair',
};

export type RootProps = {
  color: RGBA;
  seo: SEO;
};

type SEO = {
  title?: string;
  description?: string;
};

const Root: RootComponent<RootProps> = forwardRef(
  ({ color, seo, children, onScroll, ...rest }, ref: ForwardedRef<unknown>) => {
    const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
    const currentCreateType = useCreateComponentStore(
      useCallback((state) => state.newComponent?.type, [])
    );

    const { onClose } = useContextMenu();

    const onSelect = useCallback(
      (event: MouseEvent) => {
        event.stopPropagation();
        selectComponent(ROOT_NODE_ID);
        onClose();
      },
      [onClose, selectComponent]
    );

    const onContextMenu = useCallback(
      (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        selectComponent(ROOT_NODE_ID);
        onClose();
      },
      [onClose, selectComponent]
    );

    return (
      <div
        id="app-root"
        ref={ref as any}
        css={{
          cursor: cursor[currentCreateType] ?? 'auto',
          backgroundColor: rgbaToCss(color),
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
        }}
        onScroll={onScroll}
        {...rest}
        onClick={onSelect}
        onContextMenu={onContextMenu}
      >
        <div
          css={{
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
    seo: {
      title: null,
      description: null,
    },
  },
};

export default Root;
