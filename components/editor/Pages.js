import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Button, Stack, Tag, Text } from '@chakra-ui/react';
import NewPageDialog from 'components/NewPageDialog';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMyProject } from 'store/projects';
import { encode } from 'utils/url';

function PageItem({ id, name, route }) {
  const { query } = useRouter();

  return (
    <Link
      href={{
        pathname: '/dashboard/project/[projectId]',
        query: {
          page: encode(id),
          projectId: query.projectId,
        },
      }}
    >
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
    </Link>
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
          <PageItem key={it.id} id={it.id} name={it.name} route={it.route} />
        ))}
      </Stack>

      <Button mt={2} onClick={onOpen} isFullWidth size="sm">
        New Page
      </Button>

      <NewPageDialog key={isOpen} isOpen={isOpen} onClose={onClose} projectId={projectId} />
    </Box>
  );
}
