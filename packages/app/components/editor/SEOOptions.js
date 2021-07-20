import { ROOT_NODE_ID } from '@graftini/graft';
import { Stack, Typography } from '@material-ui/core';
import CanvasForm from 'canvasComponents/form/CanvasForm';
import TextInput from 'canvasComponents/form/TextInput';

export default function SEOOptions() {
  return (
    <CanvasForm componentId={ROOT_NODE_ID}>
      <Stack spacing={2} mt={2}>
        <Typography variant="subtitle2">Head</Typography>
        <TextInput name="title" label="Title" />
        <TextInput name="description" label="Description" />
      </Stack>
    </CanvasForm>
  );
}
