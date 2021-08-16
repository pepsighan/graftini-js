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
              marks: [],
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
    justifyContent: 'center',
    alignItems: 'center',
    name: 'Button',
    childrenNodes: [buttonText],
  } as BoxComponentProps,
};
export default buttonComponent;
