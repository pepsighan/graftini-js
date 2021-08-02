/** @jsxImportSource @emotion/react */
import { RGBA, rgbaToCss } from '@graftini/bricks';
import { RootComponent, ROOT_NODE_ID, useCreateComponentStore } from '@graftini/graft';
import { ScrollTrackHorizontal, ScrollTrackVertical } from 'components/DisableScrollInteraction';
import { useContextMenu } from 'components/editor/ContextMenu';
import { ForwardedRef, forwardRef, MouseEvent, useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
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
  ({ color, seo, children, onScroll, scrollRef, ...rest }, containerRef: ForwardedRef<unknown>) => {
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
      <Scrollbars
        id="app-root"
        ref={scrollRef as any}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        style={{
          width: '100vw',
          height: '100vh',
        }}
        onScroll={onScroll}
        renderTrackHorizontal={ScrollTrackHorizontal}
        renderTrackVertical={ScrollTrackVertical}
      >
        <div
          css={{
            width: '100%',
            height: '100%',
            cursor: cursor[currentCreateType] ?? 'auto',
            backgroundColor: rgbaToCss(color),
          }}
          {...rest}
          onClick={onSelect}
          onContextMenu={onContextMenu}
        >
          <div
            ref={containerRef as any}
            css={{
              pointerEvents: currentCreateType ? 'none' : null,
            }}
          >
            {children}
          </div>
        </div>
      </Scrollbars>
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
