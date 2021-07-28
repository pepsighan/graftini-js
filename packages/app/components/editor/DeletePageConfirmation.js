import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import { useDeletePage, useMyProject } from 'store/projects';

export default function DeletePageConfirmation({ projectId, pageId, isOpen, onClose }) {
  const [deletePage, { loading }] = useDeletePage({ projectId });
  const { project } = useMyProject({ projectId });
  const currentPage = useDesignerState(useCallback((state) => state.currentOpenPage, []));
  const setCurrentPage = useDesignerState(useCallback((state) => state.setCurrentPage, []));
  const deletePageFromDesigner = useDesignerState(useCallback((state) => state.deletePage, []));

  const onDelete = useCallback(async () => {
    // If the current page is selected, then before deleting select the home page.
    if (currentPage === pageId) {
      setCurrentPage(project.pages.find((it) => it.route === '/').id);
    }

    await deletePage({ variables: { projectId, pageId } });
    deletePageFromDesigner(pageId);
    onClose();
  }, [
    currentPage,
    deletePage,
    deletePageFromDesigner,
    onClose,
    pageId,
    project.pages,
    projectId,
    setCurrentPage,
  ]);

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
