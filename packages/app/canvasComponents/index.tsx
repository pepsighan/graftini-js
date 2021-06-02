import Container from './Container';
import ContainerOptions from './ContainerOptions';
import ContainerRender from './ContainerRender';
import Text from './Text';
import TextOptions from './TextOptions';
import TextRender from './TextRender';

const components = {
  Container,
  Text,
};

export default components;

export type OptionsProps = {
  componentId: string;
};

export const componentOptions = {
  Container: ContainerOptions,
  Text: TextOptions,
};

export const componentRender = {
  Container: ContainerRender,
  Text: TextRender,
};
