import { MenuItem } from '@material-ui/core';
import useBoolean from 'hooks/useBoolean';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { useCallback } from 'react';
import { ContextMenu, useContextMenu } from './ContextMenu';
import DeletePageConfirmation from './DeletePageConfirmation';
import UpdatePageDialog from './UpdatePageDialog';

export const pageContextMenuIdPrefix = 'page-context-menu-';

export default function PageContextMenu({ pageId, projectId }) {
  const { onClose: onCloseContextMenu } = useContextMenu();
  const [isEditOpen, { on: onEdit, off: onEditClose }] = useBoolean();
  const [isDeleteOpen, { on: onDelete, off: onDeleteClose }] = useBoolean();

  const onWrapClose = useCallback(
    (call) => () => {
      onCloseContextMenu();
      call();
    },
    [onCloseContextMenu]
  );

  const { project } = useMyProjectFromRouter();
  const page = project.pages.find((it) => it.id === pageId);

  return (
    <>
      <ContextMenu id={`${pageContextMenuIdPrefix}${pageId}`}>
        {page.route !== '/' && <MenuItem onClick={onWrapClose(onEdit)}>Edit</MenuItem>}
        <MenuItem disabled={page.route === '/'} onClick={onWrapClose(onDelete)}>
          Delete
        </MenuItem>
      </ContextMenu>

      <UpdatePageDialog isOpen={isEditOpen} onClose={onEditClose} />
      <DeletePageConfirmation
        isOpen={isDeleteOpen}
        pageId={pageId}
        projectId={projectId}
        onClose={onDeleteClose}
      />
    </>
  );
}
