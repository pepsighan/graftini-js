import { Canvas as Canvs, DrawMarker, DropMarker } from '@graftini/graft';
import IFrame from 'components/IFrame';
import { forwardRef } from 'react';
import theme from 'utils/theme';
import HoverOutline from './HoverOutline';
import Selection from './Selection';

const Canvas = forwardRef((_, ref) => {
  return (
    <div
      ref={ref}
      style={{
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
      >
        {() => (
          <div
            style={{
              width: '100%',
              height: '100vh',
              userSelect: 'none',
            }}
          >
            <Canvs />
            <DropMarker color={theme.colors.primary[500]} />
            <DrawMarker color={theme.colors.primary[500]} />
          </div>
        )}
      </IFrame>

      <HoverOutline />
      <Selection />
    </div>
  );
});

export default Canvas;
