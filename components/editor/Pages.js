import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Button, Text } from '@chakra-ui/react';
import NewPageDialog from 'components/NewPageDialog';
import { useMyProject } from 'store/projects';

function PageItem({ name }) {
  return (
    <Button
      isFullWidth
      justifyContent="flex-start"
      fontSize="sm"
      fontWeight="normal"
      height="unset"
      lineHeight="unset"
      py={1}
      borderRadius="none"
    >
      {name}
    </Button>
  );
}

export default function Pages({ projectId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { project } = useMyProject({ projectId });

  return (
    <Box mb={4}>
      <Text fontWeight="bold">Pages</Text>

      <Box mt={2} borderRadius="md" overflow="hidden">
        {project.pages.map((it) => (
          <PageItem key={it.id} name={it.name} />
        ))}
      </Box>

      <Button mt={2} onClick={onOpen} isFullWidth size="sm">
        New Page
      </Button>

      <NewPageDialog key={isOpen} isOpen={isOpen} onClose={onClose} projectId={projectId} />
    </Box>
  );
}
