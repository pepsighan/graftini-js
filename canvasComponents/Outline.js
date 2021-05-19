/** @jsxImportSource @emotion/react */

import { useComponentId } from '@graftini/graft';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function Outline({ children }) {
  const componentId = useComponentId();
  const isSelected = useDesignerState(
    useCallback((state) => state.selectedComponentId === componentId, [componentId])
  );
  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));

  return (
    <div
      css={{
        outline: isSelected ? '1px solid black' : null,
        '&:hover': {
          outline: '1px solid black',
        },
      }}
      onClick={useCallback(() => selectComponent(componentId), [componentId, selectComponent])}
    >
      {children}
    </div>
  );
}
