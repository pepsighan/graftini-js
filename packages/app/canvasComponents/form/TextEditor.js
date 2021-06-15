import { useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

export default function TextEditor({ initialState, isSelected }) {
  // Only initialize the editor once.
  const [editor] = useState(() => withReact(createEditor()));
  // This stores the state of the editor.
  const [value, setValue] = useState(initialState);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable readOnly={!isSelected} />
    </Slate>
  );
}
