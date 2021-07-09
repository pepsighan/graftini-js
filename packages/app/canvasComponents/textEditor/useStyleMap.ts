import { useEditorStore } from '@graftini/graft';
import { TextComponentProps } from 'canvasComponents/Text';
import { DraftStyleMap } from 'draft-js';
import { useCallback } from 'react';
import {
  addStyleOption,
  dynamicStyleOptions,
  styleMap,
  StyleOption,
  stylesInSelection,
} from './styleMap';
import { selectAll } from './textSelection';
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

/**
 * Gets the style map from the props of the text component.
 */
function getCustomStyleMap(props: TextComponentProps): DraftStyleMap {
  const defaultMap = { ...styleMap };
  const editorState = getTextEditorState(props);

  // Add the dynamic styles based on the text editor state.
  const styles = stylesInSelection(editorState, selectAll(editorState));
  styles.forEach((styleOption) => {
    // Split the style option into its two parts. Left side is the option itself and
    // right side is the value of the option.
    const split = styleOption.split('=', 2);

    if (!dynamicStyleOptions.includes(split[0] as any)) {
      // The style is not dynamic.
      return;
    }

    const style = split[1];
    // Add the style option to the map.
    addStyleOption(defaultMap, split[0] as StyleOption, style);
  });

  return defaultMap;
}
