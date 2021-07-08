import { Map } from 'immutable';

/**
 * The kind of blocks that are supported in the editor. Currently only
 * a paragraph (unstyled) is supported.
 */
export const blockMap = Map({
  unstyled: {
    element: 'div',
  },
});
