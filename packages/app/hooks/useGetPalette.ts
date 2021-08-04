import { RGBA, rgbaToCss } from '@graftini/bricks';
import { useEditorStore } from '@graftini/graft';
import { isEqual } from 'lodash-es';
import { useCallback, useMemo } from 'react';

/**
 * Gets the palette in the given page.
 */
export default function useGetPalette(): RGBA[] {
  const colors = useEditorStore(
    useCallback((state) => {
      const colors: { [key: string]: RGBA } = {};

      Object.keys(state.componentMap).forEach((key) => {
        const component = state.componentMap[key];
        if (component.type === 'Text') {
          // Skip the text component for now.
          // TODO: We will come back to it later.
          return;
        }

        if (component.type === 'Root') {
          const color = component.props.color;
          colors[rgbaToCss(color)] = color;
          return;
        }

        const color = component.props.color;
        colors[rgbaToCss(color)] = color;

        const border = component.props.border?.top;
        if (border) {
          colors[rgbaToCss(border.color)] = border.color;
        }

        // TODO: Add box shadow colors to the fold when it is added.
      });

      return colors;
    }, []),
    useCallback((left, right) => isEqual(left, right), [])
  );

  return useMemo(() => Object.values(colors), [colors]);
}
