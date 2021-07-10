import { MenuItem } from '@material-ui/core';
import useBoolean from 'hooks/useBoolean';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { useCallback } from 'react';
import ContextMenu from './ContextMenu';
import DeletePageConfirmation from './DeletePageConfirmation';

export default function PageContextMenu({ context, onClose }) {
  const [isOpen, { on, off }] = useBoolean();

  const onCloseDeleteConfirmation = useCallback(() => {
    off();
    onClose();
  }, [off, onClose]);

  const { project } = useMyProjectFromRouter();
  const page = project.pages.find((it) => it.id === context.pageId);

  return (
    <>
      <ContextMenu context={context} onClose={onClose}>
        <MenuItem disabled>Edit</MenuItem>
        {page.route !== '/' && <MenuItem onClick={on}>Delete</MenuItem>}
      </ContextMenu>

      <DeletePageConfirmation
        isOpen={isOpen}
        pageId={context.pageId}
        projectId={context.projectId}
        onClose={onCloseDeleteConfirmation}
      />
    </>
  );
}
