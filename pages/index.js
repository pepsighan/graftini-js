import { Editor } from '@craftjs/core';
import Button from 'canvasComponents/Button';
import Container from 'canvasComponents/Container';
import Root from 'canvasComponents/Root';
import Text from 'canvasComponents/Text';
import Canvas from 'components/Canvas';
import Navigation from 'components/Navigation';

export default function Home() {
  return (
    <Editor resolver={{ Root, Container, Button, Text }}>
      <Navigation />
      <Canvas />
    </Editor>
  );
}
