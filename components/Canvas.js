import { Element, Frame } from '@craftjs/core';
import Root from 'canvasComponents/Root';

export default function Canvas() {
  return (
    <Frame>
      <Element is={Root} canvas />
    </Frame>
  );
}
