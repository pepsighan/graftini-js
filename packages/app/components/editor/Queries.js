import { Box, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { mdiDelete, mdiPlus } from '@mdi/js';
import Icon from 'components/Icon';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { useCallback } from 'react';
import { useDeleteQuery } from 'store/projects';
import QueryBuilderDialog from './graphqlQuery/QueryBuilderDialog';

export default function Queries() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { project } = useMyProjectFromRouter();
  const [deleteQuery] = useDeleteQuery({ projectId: project.id });

  const onQueryDelete = useCallback(
    (id) => () => {
      deleteQuery({
        variables: {
          projectId: project.id,
          queryId: id,
        },
      });
    },
    [deleteQuery, project.id]
  );

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Text as="span" fontSize="sm" fontWeight="semibold">
          Queries
        </Text>

        <IconButton size="sm" onClick={onOpen}>
          <Icon icon={mdiPlus} />
        </IconButton>
      </Flex>

      <Box mb={4}>
        {project.queries.map((it) => (
          <Flex key={it.id} justifyContent="space-between" alignItems="center" mb={2}>
            <Text>{it.variableName}</Text>
            <IconButton size="xs" colorScheme="red" onClick={onQueryDelete(it.id)}>
              <Icon icon={mdiDelete} />
            </IconButton>
          </Flex>
        ))}

        {project.queries.length === 0 && (
          <Text mt={2} fontSize="sm" color="gray.600">
            There are no queries.
          </Text>
        )}
      </Box>

      <QueryBuilderDialog key={isOpen ? 0 : 1} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
