import React from 'react';
import Container from '../container';
import Reset from '../reset';
import Text from '../text';

export function Dialog() {
  return (
    <>
      <Reset />
      <Container
        position="absolute"
        top={0}
        left={0}
        padding={{ left: 12, right: 12, top: 16, bottom: 16 }}
        margin={{ left: 12, right: 12, top: 16, bottom: 16 }}
        color={{ r: 245, g: 245, b: 245 }}
        shadow="1px 1px 4px rgba(0,0,0,0.2)"
        borderRadius={{ bottomLeft: 4, bottomRight: 4, topLeft: 4, topRight: 4 }}
        direction="column"
      >
        <Text textAlign="center" fontWeight="bold">
          Title of the Dialog
        </Text>

        <Container margin={{ top: 8 }}>
          <Text fontSize="14px">
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
          </Text>
        </Container>
      </Container>
    </>
  );
}

const dialog = {
  title: 'Example/Dialog',
  component: Dialog,
};

export default dialog;
