import { Box, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { useCallback } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import { useDeleteQuery, useMyProjectQueries } from 'store/projects';
import { useProjectId } from './Designer';
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
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Text as="span" fontSize="sm" fontWeight="semibold">
          Queries
        </Text>

        <IconButton size="sm" onClick={onOpen}>
          <MdAdd />
        </IconButton>
      </Flex>

      <Box mb={4}>
        {queries.map((it) => (
          <Flex key={it.id} justifyContent="space-between" alignItems="center" mb={2}>
            <Text>{it.variableName}</Text>
            <IconButton size="xs" colorScheme="red" onClick={onQueryDelete(it.id)}>
              <MdDelete />
            </IconButton>
          </Flex>
        ))}

        {!loading && queries.length === 0 && (
          <Text mt={2} fontSize="sm" color="gray.600">
            There are no queries.
          </Text>
        )}
      </Box>

      <QueryBuilderDialog key={isOpen ? 0 : 1} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
