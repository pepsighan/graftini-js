import { Box as BoxRender } from '@graftini/bricks';
import Box from './Box';
import BoxOptions from './BoxOptions';
import RootOptions from './RootOptions';
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
  Root: RootOptions,
};

export const componentRender = {
  Box: BoxRender,
  Text: TextRender,
};
