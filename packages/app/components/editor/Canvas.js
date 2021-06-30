/** @jsxImportSource @emotion/react */
import {
  Canvas as Canvs,
  DragPreview,
  DrawMarker,
  DropMarker,
  useCheckCursorOnIFrame,
} from '@graftini/graft';
import IFrame from 'components/IFrame';
import theme from 'utils/theme';
import HoverOutline from './HoverOutline';
import Selection from './Selection';

export default function Canvas() {
  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <IFrame
        title="Designer"
        style={{
          width: '100%',
          height: '100%',
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
            <DropMarker color={theme.colors.primary[500]} />
            <DrawMarker color={theme.colors.primary[500]} />
            <DragPreview color={theme.colors.primary[500]} />
          </div>
        )}
      </IFrame>
      <HoverOutline />
      <Selection />
    </div>
  );
}
