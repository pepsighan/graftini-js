import Container from './Container';
import ContainerOptions from './ContainerOptions';
import Text from './Text';
import TextOptions from './TextOptions';
import { Container as Contain } from 'bricks';

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
  Container: Contain,
};
