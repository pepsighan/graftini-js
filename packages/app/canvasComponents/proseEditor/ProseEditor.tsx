/** @jsxImportSource @emotion/react */
import { Text } from '@graftini/bricks';
import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { forwardRef, MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useComponentId, useEditorStore } from '../../../graft/dist/types/graft';
import { defaultTextFormValues } from './formFields';
import trackPlugin from './trackPlugin';
import useDisableEditorWhenNotInUse from './useDisableEditorWhenNotInUse';

const schema = new Schema({
  nodes: {
    doc: { content: 'paragraph+' },
    paragraph: { content: 'text*', toDOM: () => ['div', 0] },
    text: { inline: true },
  },
});

type ProseEditorProps = {
  onInitialize: () => any;
  onMouseDown?: MouseEventHandler;
  onClick: MouseEventHandler;
  onDoubleClick: MouseEventHandler;
  onContextMenu: MouseEventHandler;
};

const ProseEditor = forwardRef(
  (
    { onClick, onContextMenu, onMouseDown, onDoubleClick, onInitialize }: ProseEditorProps,
    forwardedRef
  ) => {
    const [ref, setRef] = useState<HTMLElement>();
    const view = useRef<EditorView>(null);

    const immerSetEditor = useEditorStore(useCallback((state) => state.immerSet, []));
    const componentId = useComponentId();

    // Initialize the editor once the ref is initialized.
    useEffect(() => {
      if (!ref) {
        return;
      }

      const state = EditorState.create({
        schema,
        doc: schema.nodeFromJSON(onInitialize()),
        plugins: [trackPlugin(componentId, immerSetEditor)],
      });
      view.current = new EditorView(ref, {
        state,
        editable: () => false,
      });

      return () => view.current.destroy();
    }, [componentId, immerSetEditor, onInitialize, ref]);

    useDisableEditorWhenNotInUse(view);

    return (
      <Text
        ref={forwardedRef}
        isEditor
        onMouseDown={onMouseDown}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        {...defaultTextFormValues}
      >
        <div ref={setRef} />
      </Text>
    );
  }
);

export default ProseEditor;
