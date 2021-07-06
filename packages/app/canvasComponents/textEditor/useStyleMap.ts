import { useEditorStore } from '@graftini/graft';
import { TextComponentProps } from 'canvasComponents/Text';
import { DraftStyleMap } from 'draft-js';
import { useCallback } from 'react';
import { styleMap } from './styleMap';
import { getTextEditorState } from './useTextEditorState';

type UseStyleMapOptions = {
  componentId: string;
};

/**
 * Gets the style map for the text editor. Each text editor has a different style
 * map because we allow users to style the text any way that they want.
 */
export default function useStyleMap({ componentId }: UseStyleMapOptions): DraftStyleMap {
  return useEditorStore(
    useCallback(
      (state) => getCustomStyleMap(state.componentMap[componentId].props as TextComponentProps),
      [componentId]
    )
  );
}

function getCustomStyleMap(props: TextComponentProps): DraftStyleMap {
  if (props.customStyleMap) {
    return props.customStyleMap;
  }

  const defaultMap = { ...styleMap };
  const editorState = getTextEditorState(props);
  // Add the dynamic styles based on the text editor state.

  return defaultMap;
}
