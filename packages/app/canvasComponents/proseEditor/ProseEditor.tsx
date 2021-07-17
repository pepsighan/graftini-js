/** @jsxImportSource @emotion/react */
import { Text } from '@graftini/bricks';
import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MouseEventHandler } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';

const schema = new Schema({
  nodes: {
    doc: { content: 'paragraph+' },
    paragraph: { content: 'text*', toDOM: () => ['div', 0] },
    text: { inline: true },
  },
});

const emptyDoc = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is awesome.',
        },
      ],
    },
  ],
};

type ProseEditorProps = {
  onMouseDown?: MouseEventHandler;
  onClick: MouseEventHandler;
  onDoubleClick: MouseEventHandler;
  onContextMenu: MouseEventHandler;
};

const ProseEditor = forwardRef(
  ({ onClick, onContextMenu, onMouseDown, onDoubleClick }: ProseEditorProps, forwardedRef) => {
    const [ref, setState] = useState<HTMLElement>();
    const view = useRef<EditorView>(null);

    // Initialize the editor once the ref is initialized.
    useEffect(() => {
      if (!ref) {
        return;
      }

      const state = EditorState.create({
        schema,
        doc: schema.nodeFromJSON(emptyDoc),
      });
      view.current = new EditorView(ref, {
        state,
      });

      return () => view.current.destroy();
    }, [ref]);

    return (
      <Text
        ref={forwardedRef}
        onMouseDown={onMouseDown}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      >
        <div ref={setState} />
      </Text>
    );
  }
);

export default ProseEditor;
