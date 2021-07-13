import { MenuItem } from '@material-ui/core';
import useBoolean from 'hooks/useBoolean';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { useCallback } from 'react';
import { ContextMenu, useContextMenu } from './ContextMenu';
import DeletePageConfirmation from './DeletePageConfirmation';

export const pageContextMenuIdPrefix = 'page-context-menu-';

export default function PageContextMenu({ pageId, projectId }) {
  const { onCloseContextMenu } = useContextMenu();
  const [isOpen, { on, off }] = useBoolean();

  const onCloseDeleteConfirmation = useCallback(() => {
    off();
    onCloseContextMenu();
  }, [off, onCloseContextMenu]);

  const { project } = useMyProjectFromRouter();
  const page = project.pages.find((it) => it.id === pageId);

  return (
    <>
      <ContextMenu id={`${pageContextMenuIdPrefix}${pageId}`}>
        {page.route !== '/' && <MenuItem>Edit</MenuItem>}
        <MenuItem disabled={page.route === '/'} onClick={on}>
          Delete
        </MenuItem>
      </ContextMenu>

      <DeletePageConfirmation
        isOpen={isOpen}
        pageId={pageId}
        projectId={projectId}
        onClose={onCloseDeleteConfirmation}
      />
    </>
  );
}
