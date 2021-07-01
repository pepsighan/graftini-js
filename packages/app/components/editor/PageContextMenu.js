import { useBoolean } from '@chakra-ui/react';
import { Menu, MenuItem } from '@material-ui/core';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { useCallback } from 'react';
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
      <Menu
        open
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={
          context
            ? {
                left: context.x,
                top: context.y,
              }
            : null
        }
        MenuListProps={{ sx: { width: 150 } }}
      >
        <MenuItem disabled>Edit</MenuItem>
        {page.route !== '/' && <MenuItem onClick={on}>Delete</MenuItem>}
      </Menu>

      <DeletePageConfirmation
        isOpen={isOpen}
        pageId={context.pageId}
        projectId={context.projectId}
        onClose={onCloseDeleteConfirmation}
      />
    </>
  );
}
