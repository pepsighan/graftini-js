import { Box, Stack, Text } from '@chakra-ui/react';
import Button from 'canvasComponents/Button';
import { useMyProject } from 'store/projects';

export default function LeftSidebar({ projectId }) {
  const { project } = useMyProject({ projectId });

  return (
    <Box sx={{ width: 300, bg: 'gray.50', p: 4 }}>
      <Text fontWeight="bold">Pages</Text>

      <Stack mt={4}>
        {project.pages.map((it) => (
          <Button key={it.id}>{it.name}</Button>
        ))}
      </Stack>
    </Box>
  );
}
