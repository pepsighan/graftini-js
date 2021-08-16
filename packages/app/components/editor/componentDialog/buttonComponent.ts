import { NewComponent } from '@graftini/graft';
import Box, { BoxComponentProps } from 'canvasComponents/Box';
import Text, { TextComponentProps } from 'canvasComponents/Text';

const buttonText: NewComponent = {
  variant: 'complex',
  type: 'Text',
  isCanvas: false,
  defaultProps: {
    ...Text.graftOptions.defaultProps,
    name: 'ButtonText',
    width: 'auto',
    height: 'auto',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: {
            textAlign: 'center',
          },
          content: [
            {
              type: 'text',
              marks: [
                { type: 'fontWeight', attrs: { fontWeight: 600 } },
                {
                  type: 'color',
                  attrs: { r: 255, g: 255, b: 255, a: 1 },
                },
              ],
              text: 'Button',
            },
          ],
        },
      ],
    },
  } as TextComponentProps,
};

const buttonComponent: NewComponent = {
  variant: 'complex',
  type: 'Box',
  isCanvas: true,
  childAppendDirection: 'horizontal',
  defaultProps: {
    ...Box.graftOptions.defaultProps,
    name: 'Button',
    tag: 'button',
    color: { r: 65, g: 71, b: 104 },
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: { bottomLeft: 4, bottomRight: 4, topLeft: 4, topRight: 4 },
    childrenNodes: [buttonText],
  } as BoxComponentProps,
};
export default buttonComponent;
