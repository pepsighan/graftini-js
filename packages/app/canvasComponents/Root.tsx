/** @jsxImportSource @emotion/react */
import { RGBA, rgbaToCss } from '@graftini/bricks';
import { RootComponent, ROOT_NODE_ID, useCreateComponentStore } from '@graftini/graft';
import { ScrollTrackHorizontal, ScrollTrackVertical } from 'components/DisableScrollInteraction';
import { componentContextMenuId } from 'components/editor/ComponentContextMenu';
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
  ({ color, seo, children, onScroll, ...rest }, containerRef: ForwardedRef<unknown>) => {
    const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
    const currentCreateType = useCreateComponentStore(
      useCallback((state) => state.newComponent?.type, [])
    );
    const { onOpen: onOpenContextMenu, onClose: onCloseContextMenu } = useContextMenu();

    const onSelect = useCallback(
      (event: MouseEvent) => {
        event.stopPropagation();
        selectComponent(ROOT_NODE_ID);
        onCloseContextMenu();
      },
      [onCloseContextMenu, selectComponent]
    );

    const onContextMenu = useCallback(
      (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        selectComponent(ROOT_NODE_ID);
        onOpenContextMenu(event, componentContextMenuId);
      },
      [onOpenContextMenu, selectComponent]
    );

    return (
      <Scrollbars
        id="app-root"
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
            backgroundColor: rgbaToCss(color),
          }}
          {...rest}
          onClick={onSelect}
          onContextMenu={onContextMenu}
        >
          <div
            // The container ref is different that the scroll ref because this ref calculates the
            // intrinsic dimensions of the root. The scroll ref component is limited to the viewport
            // and cannot accurately calculate the full dimensions of the content.
            ref={containerRef as any}
            css={{
              minHeight: '100%',
              minWidth: '100%',
              // The cursor that is shown when an action is taking place.
              cursor: cursor[currentCreateType] ?? 'auto',
              // We do not show the content that overflows the intrinsic height of the children.
              // TODO: Show a dummy region after the last content to contain the overflowing
              // component. This region will also form the basis for drawing after the last
              // component. https://github.com/graftini/graftini/issues/438
              overflow: 'hidden',
            }}
          >
            {/* The children is nested one further step to accomodate for `cursor` which does not work 
            when `pointerEvents` is `none`. */}
            <div
              css={{
                minHeight: '100%',
                minWidth: '100%',
                pointerEvents: currentCreateType ? 'none' : null,
              }}
            >
              {children}
            </div>
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
