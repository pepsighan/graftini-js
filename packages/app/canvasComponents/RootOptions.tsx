import { ROOT_NODE_ID } from '@graftini/graft';
import { Stack, Typography } from '@material-ui/core';
import { useCallback } from 'react';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import { RootProps } from './Root';

export default function RootOptions() {
  const CF = CanvasForm as CanvasFormComponent<RootProps, RootProps>;

  return (
    <CF
      componentId={ROOT_NODE_ID}
      onSync={useCallback((props, state) => {
        props.color = state.color;
      }, [])}
    >
      <Stack spacing={2} mt={2}>
        <Typography variant="subtitle2">Appearance</Typography>
        <ColorPicker name="color" label="Color" />
      </Stack>
    </CF>
  );
}
