import Box from './Box';
import BoxInteractionOptions from './BoxInteractionOptions';
import BoxOptions from './BoxOptions';
import BoxRender from './BoxRender';
import RootOptions from './RootOptions';
import Text from './Text';
import TextInteractionOptions from './TextInteractionOptions';
import TextOptions from './TextOptions';
import TextRender from './TextRender';

const components = {
  Box,
  Text,
};

export default components;

export type OptionsProps = {
  componentId: string;
};

export const componentOptions = {
  Box: BoxOptions,
  Text: TextOptions,
  Root: RootOptions,
};

export const componentInteractionOptions = {
  Box: BoxInteractionOptions,
  Text: TextInteractionOptions,
};

export const componentRender = {
  Box: BoxRender,
  Text: TextRender,
};
