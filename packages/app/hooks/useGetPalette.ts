import { ProseMirrorDocument, RGBA, rgbaToCss } from '@graftini/bricks';
import { useEditorStore } from '@graftini/graft';
import { MarkKind } from 'canvasComponents/proseEditor/schema';
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

        // Extract the colors used in any text.
        if (component.type === 'Text') {
          const content: ProseMirrorDocument = component.props.content;

          content.content.forEach((para) => {
            if (!para.content) {
              return;
            }

            para.content.forEach((text) => {
              if (!text.marks) {
                return;
              }

              text.marks.forEach((mark) => {
                if (mark.type === MarkKind.TextColor) {
                  const color = mark.attrs as RGBA;
                  colors[rgbaToCss(color)] = color;
                }
              });
            });
          });

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
