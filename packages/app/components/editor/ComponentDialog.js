import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';

export default function ComponentDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Components</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          Use from the following selection of pre-built components.
        </Typography>

        <Box sx={{ mt: 1.5 }}>
          <Box sx={{ width: 100, height: 30, bgcolor: 'grey.200' }} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
