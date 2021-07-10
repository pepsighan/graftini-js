/** @jsxImportSource @emotion/react */
import {
  Canvas as Canvs,
  DragPreview,
  DrawMarker,
  DropMarker,
  useCheckCursorOnIFrame,
} from '@graftini/graft';
import { Box, useTheme } from '@material-ui/core';
import IFrame from 'components/IFrame';
import useContextMenu from 'hooks/useContextMenu';
import ComponentContextMenu from './ComponentContextMenu';
import HoverOutline from './HoverOutline';
import Selection from './Selection';

export default function Canvas() {
  const { palette } = useTheme();

  const { context, onOpenContextMenu, onCloseContextMenu } = useContextMenu();

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'white',
      }}
      onContextMenu={onOpenContextMenu}
    >
      <IFrame
        title="Designer"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        {...useCheckCursorOnIFrame()}
      >
        {() => (
          <div
            css={{
              width: '100%',
              height: '100vh',
              userSelect: 'none',
            }}
          >
            <Canvs />
            <DropMarker color={palette.primary[500]} />
            <DrawMarker color={palette.primary[500]} />
            <DragPreview color={palette.primary[500]} />
          </div>
        )}
      </IFrame>
      <HoverOutline />
      <Selection />
      {context && <ComponentContextMenu context={context} onClose={onCloseContextMenu} />}
    </Box>
  );
}
