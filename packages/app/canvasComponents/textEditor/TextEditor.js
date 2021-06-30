import { useComponentId, useEditorStore } from '@graftini/graft';
import { useCallback, useEffect, useState } from 'react';
import { createEditor } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import Element from './Element';
import HoveringToolbar from './HoveringToolbar';
import Leaf from './Leaf';

export default function TextEditor({ value, isEditable }) {
  const componentId = useComponentId();
  const immerSet = useEditorStore(useCallback((state) => state.immerSet, []));

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
      immerSet((state) => {
        state.componentMap[componentId].props.text = value;
      });
    },
    [componentId, immerSet]
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <HoveringToolbar />
      <Editable
        readOnly={!isEditable}
        renderLeaf={Leaf}
        renderElement={Element}
        renderPlaceholder
      />
    </Slate>
  );
}
