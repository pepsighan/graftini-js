import React from 'react';
import { MdArrowForward } from 'react-icons/md';
import Container from '../container';
import Reset from '../reset';
import Text from '../text';

export function Input() {
  return (
    <>
      <Reset />
      <Container
        tag="input"
        width="100%"
        color={{ r: 230, g: 230, b: 230 }}
        padding={{ left: 12, right: 12, top: 12, bottom: 12 }}
        borderRadius={{ bottomLeft: 4, bottomRight: 4, topLeft: 4, topRight: 4 }}
        placeholder="Enter your name?"
      />
    </>
  );
}

const input = {
  title: 'Example/Input',
  component: Input,
};

export default input;

export function InputWithButton() {
  return (
    <>
      <Reset />

      <Container
        width="100%"
        color={{ r: 230, g: 230, b: 230 }}
        crossAxisAlignment="center"
        borderRadius={{ bottomLeft: 4, bottomRight: 4, topLeft: 4, topRight: 4 }}
      >
        <Container
          tag="input"
          width="100%"
          padding={{ left: 12, right: 12, top: 12, bottom: 12 }}
          placeholder="Enter your name?"
        />
        <Container tag="button" padding={{ left: 16, right: 16 }} cursor="pointer">
          <Text fontSize="20px">
            <MdArrowForward />
          </Text>
        </Container>
      </Container>
    </>
  );
}
