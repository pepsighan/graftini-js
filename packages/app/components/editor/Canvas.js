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
import ComponentContextMenu, { componentContextMenuId } from './ComponentContextMenu';
import HoverOutline from './HoverOutline';
import Selection from './Selection';

export default function Canvas() {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: 'grey.50',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: '100%',
          position: 'relative',
          margin: 0.75,
          // Margin does not work on the bottom. And padding works to show the
          // scroll.
          pb: 0.75,
          backgroundColor: 'white',
          border: '1px solid',
          borderColor: 'grey.200',
        }}
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
            <div css={{ userSelect: 'none' }}>
              <Canvs />
              <DropMarker color={palette.primary[500]} />
              <DrawMarker color={palette.primary[500]} />
              <DragPreview color={palette.primary[500]} />
            </div>
          )}
        </IFrame>
        <HoverOutline />
        <Selection />
        <ComponentContextMenu id={componentContextMenuId} isCorrectionNeeded />
      </Box>
    </Box>
  );
}
