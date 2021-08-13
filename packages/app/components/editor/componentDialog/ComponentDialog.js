import { useCreateComponent } from '@graftini/graft';
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
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import buttonComponent from './buttonComponent';

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
            <ComponentItem onClose={onClose} />
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function ComponentItem({ onClose }) {
  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));
  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));

  const onCreate = useCreateComponent({
    ...buttonComponent,
    // Transform the drawn size to the one usable by the box.
    transformSize: (width, height) => {
      return {
        width: {
          size: width,
          unit: 'px',
        },
        height: {
          size: height,
          unit: 'px',
        },
      };
    },
    // Select the component which was just created.
    onCreate: (componentId) => {
      // The component is not selected if done immediately. The parent was
      // getting selected.
      setTimeout(() => {
        selectComponent(componentId);
      });
    },
  });

  const onClick = useCallback(
    (event) => {
      onCreate(event);
      unselectComponent();
      onClose();
    },
    [onClose, onCreate, unselectComponent]
  );

  return (
    <Grid item>
      <Button sx={{ flexDirection: 'column' }} onClick={onClick}>
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
