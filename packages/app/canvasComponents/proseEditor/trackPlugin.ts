import { Plugin, Selection } from 'prosemirror-state';
import { EditorStore } from '@graftini/graft';

/**
 * Tracks the current state of the prose editor and syncs it to the component's
 * content prop. It also tracks the current selection.
 */
export default function trackPlugin(
  componentId: string,
  immerSet: (fn: (state: EditorStore) => void) => void,
  setCurrentSelection: (selection: Selection) => void
) {
  return new Plugin({
    view: () => {
      return {
        update: (view) => {
          setCurrentSelection(view.state.selection);
          immerSet((state) => {
            state.componentMap[componentId].props.content = view.state.toJSON().doc;
          });
        },
      };
    },
  });
}
