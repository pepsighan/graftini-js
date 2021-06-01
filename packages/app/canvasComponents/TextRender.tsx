import { Text } from 'bricks';

export default function TextRender({ content, ...rest }) {
  return <Text {...rest}>{content}</Text>;
}
