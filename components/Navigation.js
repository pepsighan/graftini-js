import { Button, IconButton } from '@chakra-ui/button';
import { Box, Flex } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/react';
import { Element, useEditor } from '@craftjs/core';
import { default as Btn } from 'canvasComponents/Button';
import Container from 'canvasComponents/Container';
import { default as Txt } from 'canvasComponents/Text';
import { useCallback } from 'react';
import { MdCode, MdImportContacts } from 'react-icons/md';
import { RightSidebarOpenPane, useEditorState } from 'store/editor';
import { useImmerSetter } from 'store/zustand';

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
  const updateEditorState = useImmerSetter(useEditorState);

  return (
    <Flex
      py={2}
      px={4}
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top={0}
      backgroundColor="gray.50"
    >
      <Box />

      <Flex>
        <DrawButton mr={4} label="Container" component={Container} canvas connectors={connectors} />
        <DrawButton mr={4} label="Button" component={Btn} connectors={connectors} />
        <DrawButton label="Text" component={Txt} connectors={connectors} />
      </Flex>

      <IconButton
        icon={<MdCode />}
        onClick={useCallback(
          () =>
            updateEditorState((state) => {
              state.rightSidebarOpenPane =
                state.rightSidebarOpenPane === RightSidebarOpenPane.QueryBuilder
                  ? RightSidebarOpenPane.StyleOptions
                  : RightSidebarOpenPane.QueryBuilder;
            }),
          [updateEditorState]
        )}
      />
    </Flex>
  );
}
