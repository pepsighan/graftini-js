import { Canvas as Canvs, ROOT_NODE_ID } from 'graft';
import IFrame from 'components/IFrame';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function Canvas() {
  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));

  const onRootSelection = useCallback(() => {
    // The selection is not actually the root node. But since the root node is directly below.
    // Its the technically the same.
    selectComponent(ROOT_NODE_ID);
  }, [selectComponent]);

  return (
    <IFrame
      title="Designer"
      style={{
        width: '100%',
        // The height of the nav is substracted, so that the editor does not cause window-wide scroll.
        height: 'calc(100vh - 64px)',
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
        </div>
      )}
    </IFrame>
  );
}
