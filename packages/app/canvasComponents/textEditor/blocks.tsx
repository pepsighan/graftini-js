import { ContentBlock, EditorState, SelectionState } from 'draft-js';
import { Map } from 'immutable';
import { Global } from '@emotion/react';

/**
 * The options that can be provided in the block data.
 */
export enum BlockDataOption {
  TextAlignment = 'TEXT_ALIGNMENT',
}

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
export function customBlockStyle(isEditing: boolean): (contentBlock: ContentBlock) => string {
  return (contentBlock) => {
    const blockType = contentBlock.getType();

    if (blockType !== 'unstyled') {
      return '';
    }

    const data = contentBlock.getData();
    const alignment = data.get(BlockDataOption.TextAlignment);

    if (!alignment) {
      return `text-align-left ${!isEditing ? 'user-select-none' : ''}`;
    }

    return `text-align-${alignment} ${!isEditing ? 'user-select-none' : ''}`;
  };
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

        .user-select-none {
          user-select: none;
        }
      `}
    />
  );
}

/**
 * Returns a series of blocks contained in the selection.
 */
export function blocksInSelection(editor: EditorState, selection: SelectionState): ContentBlock[] {
  const contentState = editor.getCurrentContent();

  if (selection.isCollapsed()) {
    return [contentState.getBlockForKey(selection.getStartKey())];
  }

  const contentBlock: ContentBlock[] = [];

  let key = selection.getStartKey();
  const endKey = selection.getEndKey();

  // Add all the blocks in between the start and end key.
  while (true) {
    const lastRound = key === endKey;

    const block = contentState.getBlockForKey(key);
    contentBlock.push(block);

    if (lastRound) {
      break;
    }

    key = contentState.getKeyAfter(key);
  }

  return contentBlock;
}
