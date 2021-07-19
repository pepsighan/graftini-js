import { Text } from '@graftini/bricks';
import { defaultTextFormValues } from './proseEditor/formFields';
import { TextComponentProps } from './Text';

export default function TextRender({ content }: TextComponentProps) {
  // For anything that is not styled, they have the default look. The styles
  // that are configured by the user will be overridden by the content itself.
  return <Text {...defaultTextFormValues} content={content} />;
}
