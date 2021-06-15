import { useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

export default function TextEditor() {
  // Only initialize the editor once.
  const [editor] = useState(() => withReact(createEditor()));
  // This stores the state of the editor.
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'Text' }],
    },
  ]);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable />
    </Slate>
  );
}
