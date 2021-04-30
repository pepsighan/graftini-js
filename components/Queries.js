import { Box, Button, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { useCallback } from 'react';
import { MdDelete } from 'react-icons/md';
import { useEditorState } from 'store/editor';
import { useImmerSetter } from 'store/zustand';
import QueryBuilderDialog from './graphqlQuery/QueryBuilderDialog';

export default function Queries() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const savedQueries = useEditorState(useCallback((state) => state.savedQueries, []));

  const updateEditorState = useImmerSetter(useEditorState);
  const onQueryDelete = useCallback(
    (id) => () => {
      updateEditorState((state) => {
        state.savedQueries = state.savedQueries.filter((it) => it.id !== id);
      });
    },
    [updateEditorState]
  );

  return (
    <>
      <Text fontWeight="bold" mb={2}>
        Queries
      </Text>

      <Box mb={4}>
        {savedQueries.map((it) => (
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text key={it.id}>{it.variableName}</Text>
            <IconButton size="xs" colorScheme="red" onClick={onQueryDelete(it.id)}>
              <MdDelete />
            </IconButton>
          </Flex>
        ))}

        {savedQueries.length === 0 && <Text color="gray.500">There are no queries.</Text>}
      </Box>

      <Button onClick={onOpen}>New Query</Button>
      <QueryBuilderDialog key={isOpen ? 0 : 1} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
