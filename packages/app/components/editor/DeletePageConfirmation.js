import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import { useDeletePage } from 'store/projects';

export default function DeletePageConfirmation({ projectId, pageId, isOpen, onClose }) {
  const [deletePage, { loading }] = useDeletePage({ projectId });
  const deletePageFromDesigner = useDesignerState(useCallback((state) => state.deletePage, []));

  const onDelete = useCallback(async () => {
    await deletePage({ variables: { projectId, pageId } });
    deletePageFromDesigner(pageId);
    onClose();
  }, [deletePage, deletePageFromDesigner, onClose, pageId, projectId]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this page?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading} autoFocus color="inherit">
          Cancel
        </Button>
        <Button onClick={onDelete} disabled={loading} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
