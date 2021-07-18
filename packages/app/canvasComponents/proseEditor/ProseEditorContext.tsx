import { useEditorStore } from '@graftini/graft';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';
import schema from './schema';
import trackPlugin from './trackPlugin';

type OnInitializeFn = (props: { ref: HTMLElement; initialState: any; componentId: string }) => void;

type ProseEditorProviderState = {
  onInitialize: OnInitializeFn;
  editorView?: EditorView | null;
};

const ProseEditorContext = createContext<ProseEditorProviderState>(null);

export function ProseEditorProvider({ children }: PropsWithChildren<{}>) {
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const immerSetEditor = useEditorStore(useCallback((state) => state.immerSet, []));

  // Initialize the editor once the ref is initialized.
  const onInitialize: OnInitializeFn = useCallback(
    ({ ref, initialState, componentId }) => {
      if (!ref) {
        return;
      }

      const state = EditorState.create({
        schema,
        doc: schema.nodeFromJSON(initialState),
        plugins: [trackPlugin(componentId, immerSetEditor)],
      });

      const editorView = new EditorView(ref, { state });
      setEditorView((view) => {
        if (view) {
          // Remove the older view.
          view.destroy();
        }

        return editorView;
      });
    },
    [immerSetEditor]
  );

  return (
    <ProseEditorContext.Provider
      value={{
        onInitialize,
        editorView,
      }}
    >
      {children}
    </ProseEditorContext.Provider>
  );
}

export function useProseEditor(): ProseEditorProviderState {
  return useContext(ProseEditorContext);
}
