import { Text } from '@graftini/bricks';
import { Text as Txt } from 'slate';

export default function TextRender({ text, ...rest }) {
  return (
    <Text {...rest}>
      {text.map((block, index) => (
        <Block key={index} node={block} />
      ))}
    </Text>
  );
}

function Block({ node }) {
  if (Txt.isText(node)) {
    let text = node.text;
    if (node.bold) {
      text = (
        <Text tag="strong" displayInline fontWeight={600}>
          {text}
        </Text>
      );
    }
    // TODO: Reset the text style to not have anything and provide italics and underline
    // via the Text component.
    if (node.italic) {
      text = (
        <Text tag="em" displayInline>
          {text}
        </Text>
      );
    }
    if (node.underlined) {
      text = (
        <Text tag="u" displayInline>
          {text}
        </Text>
      );
    }
    return text;
  }

  const children = node.children.map((n) => <Block node={n} />);
  switch (node.type) {
    case 'paragraph':
      return <p>{children}</p>;
    default:
      return children;
  }
}
