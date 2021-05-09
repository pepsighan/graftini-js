import { Box, Button, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { useCallback } from 'react';
import { MdDelete } from 'react-icons/md';
import { useDeleteQuery, useMyProjectQueries } from 'store/projects';
import { useProjectId } from './Editor';
import QueryBuilderDialog from './graphqlQuery/QueryBuilderDialog';

export default function Queries() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const projectId = useProjectId();
  const { queries, loading } = useMyProjectQueries({ projectId });
  const [deleteQuery] = useDeleteQuery({ projectId });

  const onQueryDelete = useCallback(
    (id) => () => {
      deleteQuery({
        variables: {
          projectId,
          queryId: id,
        },
      });
    },
    [deleteQuery, projectId]
  );

  return (
    <>
      <Text fontWeight="bold" mb={2}>
        Queries
      </Text>

      <Box mb={4}>
        {queries.map((it) => (
          <Flex key={it.id} justifyContent="space-between" alignItems="center" mb={2}>
            <Text>{it.variableName}</Text>
            <IconButton size="xs" colorScheme="red" onClick={onQueryDelete(it.id)}>
              <MdDelete />
            </IconButton>
          </Flex>
        ))}

        {!loading && queries.length === 0 && <Text color="gray.500">There are no queries.</Text>}
      </Box>

      <Button onClick={onOpen}>New Query</Button>
      <QueryBuilderDialog key={isOpen ? 0 : 1} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
