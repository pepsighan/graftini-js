import { Dialog, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core';
import { isMacOs } from 'react-device-detect';

const CtrlKey = isMacOs ? '⌘' : 'Ctrl';

export default function ShortcutsDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>Shortcuts</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <ShortcutKey shortcut={`Mouse Resize`} meaning="Resizes in px unit" />
          <ShortcutKey shortcut={`${CtrlKey} + Mouse Resize`} meaning="Resizes in % unit" />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutKey({ shortcut, meaning }) {
  return (
    <>
      <Grid item xs={4}>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          sx={{ bgcolor: 'grey.300', px: 1, borderRadius: 0.5 }}
        >
          {shortcut}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="subtitle2" color="textSecondary">
          {meaning}
        </Typography>
      </Grid>
    </>
  );
}
