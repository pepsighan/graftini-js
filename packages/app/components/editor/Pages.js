import { useDisclosure } from '@chakra-ui/hooks';
import { Box, IconButton, Typography } from '@material-ui/core';
import { PlusIcon } from '@modulz/radix-icons';
import NewPageDialog from 'components/NewPageDialog';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import { encode } from 'utils/url';
import { useEffectOnce } from 'utils/useEffect';
import PageItem from './PageItem';

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
    <Box sx={{ flex: 1, px: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2">Pages</Typography>

        <IconButton size="small" onClick={onOpen}>
          <PlusIcon />
        </IconButton>
      </Box>

      <Box>
        {project.pages.map((it) => (
          <PageItem
            key={it.id}
            id={it.id}
            name={it.name}
            route={it.route}
            slugProjectId={slugProjectId}
            projectId={project.id}
          />
        ))}
      </Box>

      <NewPageDialog key={isOpen} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
