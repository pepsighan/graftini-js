import { Text } from '@graftini/bricks';
import { TextComponentProps } from './Text';

export default function TextRender({ content }: TextComponentProps) {
  return <Text content={content} />;
}
