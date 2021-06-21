import { useComponentId, useEditor } from '@graftini/graft';
import { useCallback, useEffect, useState } from 'react';
import { createEditor } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import HoveringToolbar from './HoveringToolbar';
import Leaf from './Leaf';

export default function TextEditor({ value, isEditable }) {
  const componentId = useComponentId();
  const { updateComponentProps } = useEditor();

  // Only initialize the editor once.
  const [editor] = useState(() => withReact(createEditor()));

  // Focus the editor once it is selected.
  useEffect(() => {
    if (isEditable) {
      ReactEditor.focus(editor);
    }
  }, [editor, isEditable]);

  const onChange = useCallback(
    (value) => {
      updateComponentProps(componentId, (props) => ({ ...props, text: value }));
    },
    [componentId, updateComponentProps]
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <HoveringToolbar />
      <Editable readOnly={!isEditable} renderLeaf={Leaf} />
    </Slate>
  );
}
