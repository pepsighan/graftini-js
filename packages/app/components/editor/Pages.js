import { Box, IconButton, Typography } from '@material-ui/core';
import { PlusIcon } from '@modulz/radix-icons';
import useBoolean from 'hooks/useBoolean';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDesignerState } from 'store/designer';
import { encode } from 'utils/url';
import { useEffectOnce } from 'utils/useEffect';
import NewPageDialog from './NewPageDialog';
import PageItem from './PageItem';

export default function Pages() {
  const { query, push } = useRouter();
  const slugProjectId = query.projectId;

  const [isOpen, { on, off }] = useBoolean();
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
    <Box sx={{ flex: 1, px: 1.5, overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2">Pages</Typography>

        <IconButton size="small" onClick={on}>
          <PlusIcon />
        </IconButton>
      </Box>

      <Scrollbars autoHide autoHideTimeout={1000} autoHideDuration={200} style={{ flex: 1 }}>
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
      </Scrollbars>

      <NewPageDialog key={isOpen} isOpen={isOpen} onClose={off} />
    </Box>
  );
}
