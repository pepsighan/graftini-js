import Box from './Box';
import BoxOptions from './BoxOptions';
import BoxRender from './BoxRender';
import Text from './Text';
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
};

export const componentRender = {
  Box: BoxRender,
  Text: TextRender,
};
