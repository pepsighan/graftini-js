import { Text } from '@graftini/components';

export default function TextRender({ content, ...rest }) {
  return <Text {...rest}>{content}</Text>;
}
