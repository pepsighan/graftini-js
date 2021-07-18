import { useEditorStore } from '@graftini/graft';
import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { useContext } from 'react';
import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import trackPlugin from './trackPlugin';

type OnInitializeFn = (props: { ref: HTMLElement; initialState: any; componentId: string }) => void;

type ProseEditorProviderState = {
  onInitialize: OnInitializeFn;
  editorView?: EditorView | null;
};

const ProseEditorContext = createContext<ProseEditorProviderState>(null);

const schema = new Schema({
  nodes: {
    doc: { content: 'paragraph+' },
    paragraph: { content: 'text*', toDOM: () => ['div', 0] },
    text: { inline: true },
  },
});

export function ProseEditorProvider({ children }: PropsWithChildren<{}>) {
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const immerSetEditor = useEditorStore(useCallback((state) => state.immerSet, []));

  // Initialize the editor once the ref is initialized.
  const onInitialize: OnInitializeFn = useCallback(
    ({ ref, initialState, componentId }) => {
      console.log({ initialState, ref });

      if (!ref) {
        setEditorView(null);
        return;
      }

      const state = EditorState.create({
        schema,
        doc: schema.nodeFromJSON(initialState),
        plugins: [trackPlugin(componentId, immerSetEditor)],
      });

      const editorView = new EditorView(ref, { state });
      setEditorView(editorView);
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
