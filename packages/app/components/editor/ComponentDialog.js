import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';

export default function ComponentDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Components</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          Use the following pre-built components to design faster rather than making everything from
          scratch.
        </Typography>

        <Box sx={{ mt: 1.5 }}>
          <Grid container>
            <ComponentItem />
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function ComponentItem() {
  return (
    <Grid item>
      <Button sx={{ flexDirection: 'column' }}>
        <Paper sx={{ padding: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'primary.500',
              width: 100,
              height: 30,
              borderRadius: 1,
            }}
          >
            <Typography color="white" sx={{ fontWeight: 500 }}>
              Button
            </Typography>
          </Box>
        </Paper>
        <Typography textAlign="center" variant="subtitle2">
          Button
        </Typography>
      </Button>
    </Grid>
  );
}
