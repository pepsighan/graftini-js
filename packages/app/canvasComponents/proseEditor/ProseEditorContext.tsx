import { useEditorStore } from '@graftini/graft';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { useGetSet } from 'react-use';
import schema from './schema';
import trackPlugin from './trackPlugin';

type OnInitializeFn = (props: { ref: HTMLElement; initialState: any; componentId: string }) => void;

type ProseEditorProviderState = {
  onInitialize: OnInitializeFn;
  getEditorView: () => EditorView | null;
};

const ProseEditorContext = createContext<ProseEditorProviderState>(null);

export function ProseEditorProvider({ children }: PropsWithChildren<{}>) {
  const [getEditorView, setEditorView] = useGetSet<EditorView | null>(null);
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

        return;
      }

      const state = EditorState.create({
        schema,
        doc: schema.nodeFromJSON(initialState),
        plugins: [trackPlugin(componentId, immerSetEditor), keymap(baseKeymap)],
      });

      const editorView = new EditorView(ref, { state });
      setEditorView(editorView);
    },
    [immerSetEditor, setEditorView]
  );

  return (
    <ProseEditorContext.Provider
      value={{
        onInitialize,
        getEditorView,
      }}
    >
      {children}
    </ProseEditorContext.Provider>
  );
}

export function useProseEditor(): ProseEditorProviderState {
  return useContext(ProseEditorContext);
}
