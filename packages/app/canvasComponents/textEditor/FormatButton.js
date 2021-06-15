/** @jsxImportSource @emotion/react */
import Icon from 'components/Icon';
import { Editor, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import theme from 'utils/theme';

export default function FormatButton({ format, icon }) {
  const editor = useSlate();
  return (
    <button
      css={{
        width: 32,
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: theme.space[5],
        paddingRight: theme.space[5],
        paddingTop: theme.space[2],
        paddingBottom: theme.space[2],
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: theme.colors.gray[200],
        },
      }}
      onClick={(event) => {
        event.preventDefault();
        toggleFormat(editor, format);
      }}
    >
      <Icon icon={icon} fontSize={18} />
    </button>
  );
}

function isFormatActive(editor, format) {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[format] === true,
    mode: 'all',
  });
  return !!match;
}

function toggleFormat(editor, format) {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  );
}
