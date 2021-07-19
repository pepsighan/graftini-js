import { useEditorStore } from '@graftini/graft';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { AllSelection, EditorState, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { useGetSet } from 'react-use';
import schema from './schema';
import trackPlugin from './trackPlugin';

type OnInitializeFn = (props: { ref: HTMLElement; initialState: any; componentId: string }) => void;

type ProseEditorProviderState = {
  onInitialize: OnInitializeFn;
  getEditorView: () => EditorView | null;
  getCurrentSelection: () => Selection | null;
};

const ProseEditorContext = createContext<ProseEditorProviderState>(null);

export function ProseEditorProvider({ children }: PropsWithChildren<{}>) {
  const [getEditorView, setEditorView] = useGetSet<EditorView | null>(null);
  const [getCurrentSelection, setCurrentSelection] = useGetSet<Selection | null>(null);

  const immerSetEditor = useEditorStore(useCallback((state) => state.immerSet, []));

  // Initialize the editor once the ref is initialized.
  const onInitialize: OnInitializeFn = useCallback(
    ({ ref, initialState, componentId }) => {
      if (!ref) {
        setEditorView((view) => {
          if (view) {
            // Remove the older view.
            view.destroy();
          }

          return null;
        });
        setCurrentSelection(null);
        return;
      }

      const state = EditorState.create({
        schema,
        doc: schema.nodeFromJSON(initialState),
        plugins: [
          trackPlugin(componentId, immerSetEditor, setCurrentSelection),
          keymap(baseKeymap),
        ],
      });

      const editorView = new EditorView(ref, { state, editable: () => false });
      setEditorView(editorView);

      // We select all the text during selection of the text editor (and not in editing mode).
      // This selection is only a stop-gap measure to allow text styling the whole thing
      // until the user goes into editing mode and selects whatever text they want.
      // Once some style has changes, [getCurrentSelection] reflects the actual selection
      // via [trackPlugin].
      setCurrentSelection(new AllSelection(editorView.state.doc));
    },
    [immerSetEditor, setCurrentSelection, setEditorView]
  );

  return (
    <ProseEditorContext.Provider
      value={{
        onInitialize,
        getEditorView,
        getCurrentSelection,
      }}
    >
      {children}
    </ProseEditorContext.Provider>
  );
}

export function useProseEditor(): ProseEditorProviderState {
  return useContext(ProseEditorContext);
}
