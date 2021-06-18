import { useComponentId, useEditor } from 'graft';
import { useCallback, useEffect, useState } from 'react';
import { createEditor } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import HoveringToolbar from './HoveringToolbar';
import Leaf from './Leaf';

export default function TextEditor({ value, isSelected }) {
  const componentId = useComponentId();
  const { updateComponentProps } = useEditor();

  // Only initialize the editor once.
  const [editor] = useState(() => withReact(createEditor()));

  // Focus the editor once it is selected.
  useEffect(() => {
    if (isSelected) {
      ReactEditor.focus(editor);
    }
  }, [editor, isSelected]);

  const onChange = useCallback(
    (value) => {
      updateComponentProps(componentId, (props) => ({ ...props, text: value }));
    },
    [componentId, updateComponentProps]
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <HoveringToolbar />
      <Editable readOnly={!isSelected} renderLeaf={Leaf} />
    </Slate>
  );
}
