import IFrame from 'components/IFrame';
import { Canvas as Canvs, DrawMarker, DropMarker } from 'graft';
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
            <HoverOutline />
            <Selection />
          </div>
        )}
      </IFrame>
    </div>
  );
});

export default Canvas;
