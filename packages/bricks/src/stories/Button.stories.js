import React from 'react';
import { MdCake } from 'react-icons/md';
import Container from '../container';
import Reset from '../reset';
import Text from '../text';

export function Button() {
  return (
    <>
      <Reset />
      <Container
        tag="button"
        width="100%"
        mainAxisAlignment="center"
        padding={{ left: 12, right: 12, top: 16, bottom: 16 }}
        color={{ r: 120, g: 120, b: 240 }}
        cursor="pointer"
        borderRadius={{ bottomLeft: 4, bottomRight: 4, topLeft: 4, topRight: 4 }}
      >
        <Container crossAxisAlignment="center">
          <Text color={{ r: 255, g: 255, b: 255 }}>
            <MdCake />
          </Text>
          <Container margin={{ left: 12 }}>
            <Text color={{ r: 255, g: 255, b: 255 }}>Click</Text>
          </Container>
        </Container>
      </Container>
    </>
  );
}

const button = {
  title: 'Example/Button',
  component: Button,
};

export default button;
