import { Box, Button, Stack, Text, useDisclosure } from '@chakra-ui/react';
import NewPageDialog from 'components/NewPageDialog';
import { useMyProject } from 'store/projects';

export default function LeftSidebar({ projectId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { project } = useMyProject({ projectId });

  return (
    <>
      <Box sx={{ width: 300, bg: 'gray.50', p: 4 }}>
        <Text fontWeight="bold">Pages</Text>

        <Stack mt={4}>
          {project.pages.map((it) => (
            <Button key={it.id}>{it.name}</Button>
          ))}
        </Stack>

        <Button onClick={onOpen} isFullWidth size="sm">
          New Page
        </Button>
      </Box>

      <NewPageDialog isOpen={isOpen} onClose={onClose} projectId={projectId} />
    </>
  );
}
