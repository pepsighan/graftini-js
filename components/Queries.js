import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useEditorState } from 'store/editor';
import QueryBuilderDialog from './graphqlQuery/QueryBuilderDialog';

export default function Queries() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const savedQueries = useEditorState(useCallback((state) => state.savedQueries, []));

  return (
    <>
      <Text fontWeight="bold" mb={2}>
        Queries
      </Text>

      <Box mb={4}>
        {savedQueries.map((it) => (
          <Text key={it.id}>{it.variableName}</Text>
        ))}

        {savedQueries.length === 0 && <Text color="gray.500">There are no queries.</Text>}
      </Box>

      <Button onClick={onOpen}>New Query</Button>
      <QueryBuilderDialog key={isOpen ? 0 : 1} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
