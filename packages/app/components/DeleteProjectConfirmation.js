import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
} from '@material-ui/core';
import useBoolean from 'hooks/useBoolean';
import { useCallback } from 'react';
import { useDeleteProject } from 'store/projects';

export default function DeleteProjectConfirmation({ projectId, children }) {
  const [deleteProject, { loading }] = useDeleteProject();
  const [isOpen, { on, off }] = useBoolean();

  const onDelete = useCallback(async () => {
    await deleteProject({ variables: { projectId } });
    off();
  }, [deleteProject, off, projectId]);

  return (
    <>
      <IconButton onClick={on} color="error" sx={{ width: 32 }}>
        {children}
      </IconButton>

      <Dialog open={isOpen} onClose={off}>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this project?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={off} disabled={loading} autoFocus>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={onDelete} disabled={loading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
