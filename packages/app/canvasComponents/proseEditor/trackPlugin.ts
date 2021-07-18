import { Plugin } from 'prosemirror-state';
import { EditorStore } from '@graftini/graft';

/**
 * Tracks the current state of the prose editor and syncs it to the component's
 * content prop.
 */
export default function trackPlugin(
  componentId: string,
  immerSet: (fn: (state: EditorStore) => void) => void
) {
  return new Plugin({
    view: () => {
      return {
        update: (view) => {
          immerSet((state) => {
            state.componentMap[componentId].props.content = view.state.toJSON().doc;
          });
        },
      };
    },
  });
}
