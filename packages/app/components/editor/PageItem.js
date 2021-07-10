import { Button, Tooltip } from '@material-ui/core';
import useContextMenu from 'hooks/useContextMenu';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import { encode } from 'utils/url';
import PageContextMenu from './PageContextMenu';

export default function PageItem({ id, name, route, slugProjectId, projectId }) {
  const isSelected = useDesignerState(useCallback((state) => state.currentOpenPage === id, [id]));
  const setCurrentPage = useDesignerState(useCallback((state) => state.setCurrentPage, []));

  const { replace } = useRouter();
  const onPageChange = useCallback(() => {
    // Add the route by replace existing one. These page routes are internal to the editor
    // and should not be adding history to the router.
    replace({
      pathname: '/dashboard/project/[projectId]',
      query: {
        page: encode(id),
        projectId: slugProjectId,
      },
    });

    setCurrentPage(id);
  }, [id, replace, setCurrentPage, slugProjectId]);

  const { context, onOpenContextMenu, onCloseContextMenu } = useContextMenu({
    data: {
      projectId,
      pageId: id,
    },
  });

  // TODO: Do not cause history to change. Since the pages are used to change
  // the views in the editor rather than change route for the app.
  return (
    <>
      <Tooltip title={route}>
        <Button
          fullWidth
          color="inherit"
          sx={{
            justifyContent: 'flex-start',
            backgroundColor: isSelected ? 'grey.200' : null,
          }}
          onClick={onPageChange}
          onContextMenu={onOpenContextMenu}
        >
          {name}
        </Button>
      </Tooltip>

      {context && <PageContextMenu context={context} onClose={onCloseContextMenu} />}
    </>
  );
}
