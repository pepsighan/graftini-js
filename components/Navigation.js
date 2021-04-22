import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/react';
import { Element, useEditor } from '@craftjs/core';
import { default as Btn } from 'canvasComponents/Button';
import Container from 'canvasComponents/Container';
import { default as Txt } from 'canvasComponents/Text';
import { useCallback } from 'react';
import { MdImportContacts } from 'react-icons/md';

function DrawButton({ connectors, mr, label, component: Component, canvas }) {
  const ref = useCallback(
    (ref) => connectors.create(ref, <Element is={Component} canvas={canvas} />),
    [Component, canvas, connectors]
  );

  return (
    <Button
      ref={ref}
      variant="outline"
      size="lg"
      sx={{ flexDirection: 'column', px: 3, color: 'gray.600', mr, width: '80px' }}
    >
      <MdImportContacts />
      <Text sx={{ fontSize: 'xs', fontWeight: 'normal', mt: 1 }}>{label}</Text>
    </Button>
  );
}

export default function Navigation() {
  const { connectors } = useEditor();

  return (
    <Flex sx={{ py: 2, px: 4, justifyContent: 'center', backgroundColor: 'gray.50' }}>
      <DrawButton mr={4} label="Container" component={Container} canvas connectors={connectors} />
      <DrawButton mr={4} label="Button" component={Btn} connectors={connectors} />
      <DrawButton label="Text" component={Txt} connectors={connectors} />
    </Flex>
  );
}
