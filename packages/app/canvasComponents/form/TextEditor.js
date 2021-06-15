import { useEffect, useState } from 'react';
import { createEditor } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';

export default function TextEditor({ initialState, isSelected }) {
  // Only initialize the editor once.
  const [editor] = useState(() => withReact(createEditor()));
  // This stores the state of the editor.
  const [value, setValue] = useState(initialState);

  // Focus the editor once it is selected.
  useEffect(() => {
    if (isSelected) {
      ReactEditor.focus(editor);
    }
  }, [editor, isSelected]);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable readOnly={!isSelected} style={{ backgroundColor: isSelected ? 'white' : null }} />
    </Slate>
  );
}
