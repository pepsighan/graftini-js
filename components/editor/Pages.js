import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Button, Stack, Text, Tag } from '@chakra-ui/react';
import NewPageDialog from 'components/NewPageDialog';
import { useMyProject } from 'store/projects';

function PageItem({ name, route }) {
  return (
    <Button
      isFullWidth
      justifyContent="space-between"
      alignItems="center"
      fontSize="sm"
      fontWeight="normal"
      height="unset"
      lineHeight="unset"
      py={2}
    >
      {name}

      <Tag fontSize="xs" fontFamily="mono">
        {route}
      </Tag>
    </Button>
  );
}

export default function Pages({ projectId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { project } = useMyProject({ projectId });

  return (
    <Box mb={4}>
      <Text fontWeight="bold">Pages</Text>

      <Stack mt={2}>
        {project.pages.map((it) => (
          <PageItem key={it.id} name={it.name} route={it.route} />
        ))}
      </Stack>

      <Button mt={2} onClick={onOpen} isFullWidth size="sm">
        New Page
      </Button>

      <NewPageDialog key={isOpen} isOpen={isOpen} onClose={onClose} projectId={projectId} />
    </Box>
  );
}
