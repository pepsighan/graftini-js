import { Plugin } from 'prosemirror-state';

export const trackPlugin = new Plugin({
  view: () => {
    return {
      update: (_, prevState) => {
        console.log(prevState.toJSON());
      },
    };
  },
});
