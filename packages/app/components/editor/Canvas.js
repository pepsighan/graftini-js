import IFrame from 'components/IFrame';
import { Canvas as Canvs, DropMarker, ROOT_NODE_ID } from 'graft';
import { forwardRef, useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

const Canvas = forwardRef((_, ref) => {
  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));

  const onRootSelection = useCallback(() => {
    // The selection is not actually the root node. But since the root node is directly below.
    // Its the technically the same.
    selectComponent(ROOT_NODE_ID);
  }, [selectComponent]);

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
          border: '1px',
          borderColor: 'gray.300',
          // Any content that overflows vertically will have the scrollbar on this box itself.
          overflowY: 'auto',
        }}
      >
        {() => (
          <div
            onClick={onRootSelection}
            style={{
              width: '100%',
              height: '100vh',
              userSelect: 'none',
            }}
          >
            <Canvs />
            <DropMarker color={theme.colors.primary[500]} />
          </div>
        )}
      </IFrame>
    </div>
  );
});

export default Canvas;
