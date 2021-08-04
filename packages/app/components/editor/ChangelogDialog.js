import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

// Increment this once the changelog has been updated.
export const version = '1';

export default function ChangelogDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>Changelog</DialogTitle>
      <DialogContent>Changelog</DialogContent>
    </Dialog>
  );
}
