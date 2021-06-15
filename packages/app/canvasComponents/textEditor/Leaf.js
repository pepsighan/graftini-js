/** @jsxImportSource @emotion/react */

export default function Leaf({ attributes, children, leaf }) {
  if (leaf.bold) {
    children = <strong css={{ fontWeight: 'bold' }}>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em css={{ fontStyle: 'italic' }}>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u css={{ textDecoration: 'underline' }}>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
}
