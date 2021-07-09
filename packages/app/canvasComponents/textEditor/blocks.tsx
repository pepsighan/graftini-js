import { ContentBlock } from 'draft-js';
import { Map } from 'immutable';
import { Global } from '@emotion/react';

/**
 * The kind of blocks that are supported in the editor. Currently only
 * a paragraph (unstyled) is supported.
 */
export const blockMap = Map({
  // The default is unstyled. So this becomes our Paragraph.
  unstyled: {
    element: 'div',
  },
});

/**
 * The custom styles for the blocks based on the metadata.
 */
export function customBlockStyle(contentBlock: ContentBlock): string {
  const blockType = contentBlock.getType();

  if (blockType !== 'unstyled') {
    return '';
  }

  return 'text-align-left';
}

/**
 * The [customBlockStyle] function can only return classNames. So, this component
 * defines the global styles used there.
 */
export function GlobalBlockStyles() {
  return (
    <Global
      styles={`
        .text-align-left {
          text-align: left;
        }
      
        .text-align-center {
          text-align: center;
        }

        .text-align-right {
          text-align: right;
        }

        .text-align-justify {
          text-align: justify;
        }
      `}
    />
  );
}
