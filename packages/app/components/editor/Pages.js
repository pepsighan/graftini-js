import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Button, Flex, IconButton, Stack, Tag, Text } from '@chakra-ui/react';
import NewPageDialog from 'components/NewPageDialog';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { MdAdd } from 'react-icons/md';
import { useDesignerState } from 'store/designer';
import { encode } from 'utils/url';
import { useEffectOnce } from 'utils/useEffect';

function PageItem({ id, name, route, slugProjectId }) {
  const isSelected = useDesignerState(useCallback((state) => state.currentOpenPage === id, [id]));
  const setCurrentPage = useDesignerState(useCallback((state) => state.setCurrentPage, []));

  const onPageChange = useCallback(() => {
    setCurrentPage(id);
  }, [id, setCurrentPage]);

  // TODO: Do not cause history to change. Since the pages are used to change
  // the views in the editor rather than change route for the app.
  return (
    <Link
      href={{
        pathname: '/dashboard/project/[projectId]',
        query: {
          page: encode(id),
          projectId: slugProjectId,
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
        isActive={isSelected}
        onClick={onPageChange}
      >
        {name}

        <Tag fontSize="xs" fontFamily="mono">
          {route}
        </Tag>
      </Button>
    </Link>
  );
}

export default function Pages() {
  const { query, push } = useRouter();
  const slugProjectId = query.projectId;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { project } = useMyProjectFromRouter();

  const defaultPageId = useDesignerState(
    useCallback((state) => state.currentOpenPage, []),
    // Only load the open page for the first time.
    useCallback(() => false, [])
  );

  useEffectOnce(() => {
    // Add the page id to the path.
    push({
      pathname: '/dashboard/project/[projectId]',
      query: {
        page: encode(defaultPageId),
        projectId: slugProjectId,
      },
    });
  });

  return (
    <Box height="50%" px={3}>
      <Flex justifyContent="space-between" alignItems="center">
        <Text as="span" fontSize="sm" fontWeight="bold">
          Pages
        </Text>

        <IconButton onClick={onOpen} size="sm">
          <MdAdd />
        </IconButton>
      </Flex>

      <Stack mt={1}>
        {project.pages.map((it) => (
          <PageItem
            key={it.id}
            id={it.id}
            name={it.name}
            route={it.route}
            slugProjectId={slugProjectId}
          />
        ))}
      </Stack>

      <NewPageDialog key={isOpen} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
