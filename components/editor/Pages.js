import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Button, Stack, Tag, Text } from '@chakra-ui/react';
import NewPageDialog from 'components/NewPageDialog';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useEditorState } from 'store/editor';
import { useMyProject } from 'store/projects';
import { useImmerSetter } from 'store/zustand';
import { encode } from 'utils/url';
import { useEffectOnce } from 'utils/useEffect';
import { useProjectId } from './Editor';

function PageItem({ id, name, route, slugProjectId }) {
  const isSelected = useEditorState(useCallback((state) => state.currentOpenPage === id, [id]));
  const updateEditorState = useImmerSetter(useEditorState);

  const onPageChange = useCallback(() => {
    updateEditorState((state) => {
      state.currentOpenPage = id;
    });
  }, [id, updateEditorState]);

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
  const { project } = useMyProject({ projectId: useProjectId() });

  const defaultPageId = useEditorState(
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
    <Box mb={4}>
      <Text fontWeight="bold">Pages</Text>

      <Stack mt={2}>
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

      <Button mt={2} onClick={onOpen} isFullWidth size="sm">
        New Page
      </Button>

      <NewPageDialog key={isOpen} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
