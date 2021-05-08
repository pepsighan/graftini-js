import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Button, Text } from '@chakra-ui/react';
import NewPageDialog from 'components/NewPageDialog';
import { useMyProject } from 'store/projects';

function PageItem({ name }) {
  return <Button isFullWidth>{name}</Button>;
}

export default function Pages({ projectId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { project } = useMyProject({ projectId });

  return (
    <Box mb={4}>
      <Text fontWeight="bold">Pages</Text>

      <Box my={4}>
        {project.pages.map((it) => (
          <PageItem key={it.id} name={it.name} />
        ))}
      </Box>

      <Button onClick={onOpen} isFullWidth size="sm">
        New Page
      </Button>

      <NewPageDialog key={isOpen} isOpen={isOpen} onClose={onClose} projectId={projectId} />
    </Box>
  );
}
