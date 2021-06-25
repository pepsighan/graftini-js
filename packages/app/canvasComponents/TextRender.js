import { Text, TextBody } from '@graftini/bricks';

export default function TextRender({ text, ...rest }) {
  return (
    <Text {...rest}>
      <TextBody content={text} />
    </Text>
  );
}
