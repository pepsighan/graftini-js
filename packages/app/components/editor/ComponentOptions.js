import { ROOT_NODE_ID } from '@graftini/graft';
import { componentOptions } from 'canvasComponents';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function StyleOptions() {
  const selectedComponentId = useDesignerState(
    useCallback((state) => state.selectedComponentId, [])
  );

  const type = useDesignerState(
    useCallback((state) => {
      if (state.selectedComponentId === ROOT_NODE_ID) {
        return 'Root';
      }

      return state.selectedComponentId
        ? state.pages[state.currentOpenPage]?.[state.selectedComponentId]?.type ?? null
        : null;
    }, [])
  );

  const Options = type ? componentOptions[type] : null;
  return (
    <>
      {Options != null ? (
        <Options key={selectedComponentId} componentId={selectedComponentId} />
      ) : null}
    </>
  );
}
