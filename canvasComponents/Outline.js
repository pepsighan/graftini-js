/** @jsxImportSource @emotion/react */

import { useComponentId, useEditorState } from '@graftini/graft';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function Outline({ children }) {
  const componentId = useComponentId();
  const isSelected = useDesignerState(
    useCallback((state) => state.selectedComponentId === componentId, [componentId])
  );
  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));

  const name = useEditorState(useCallback((state) => state[componentId].props.name, [componentId]));

  return (
    <div
      css={{
        position: 'relative',
        outline: isSelected ? '1px solid #9999ff' : null,
        '& > .component-toolbox': {
          display: isSelected ? 'block' : 'none',
        },

        '&:hover': {
          outline: '1px solid #9999ff',
        },
      }}
      onClick={useCallback(
        (ev) => {
          ev.stopPropagation();
          return selectComponent(componentId);
        },
        [componentId, selectComponent]
      )}
    >
      <div
        className="component-toolbox"
        css={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'translateY(-100%)',
          fontSize: 12,
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 2,
          paddingBottom: 2,
          backgroundColor: '#9999ff',
        }}
      >
        {name || 'Untitled'}
      </div>
      {children}
    </div>
  );
}
