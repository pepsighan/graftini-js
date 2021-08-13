import { NewComponent } from '@graftini/graft';
import Box from 'canvasComponents/Box';
import Text from 'canvasComponents/Text';

const buttonText: NewComponent = {
  variant: 'complex',
  type: 'Text',
  isCanvas: false,
  defaultProps: {
    ...Text.graftOptions.defaultProps,
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
  },
};

const buttonComponent: NewComponent = {
  variant: 'complex',
  type: 'Box',
  isCanvas: true,
  childAppendDirection: 'horizontal',
  defaultProps: {
    ...Box.graftOptions.defaultProps,
    childrenNodes: [buttonText],
  },
};
export default buttonComponent;
