import { ROOT_NODE_ID } from '@graftini/graft';
import { Stack, Typography } from '@material-ui/core';
import CanvasForm, { CanvasFormComponent } from 'canvasComponents/form/CanvasForm';
import TextInput from 'canvasComponents/form/TextInput';
import { RootProps } from 'canvasComponents/Root';
import { useCallback } from 'react';

export default function SEOOptions() {
  const CF = CanvasForm as CanvasFormComponent<RootProps, RootProps>;

  return (
    <CF
      componentId={ROOT_NODE_ID}
      onSync={useCallback((props, state) => {
        // This may not exist on older projects.
        props.seo ??= {};

        props.seo.title = state.seo.title;
        props.seo.description = state.seo.description;
      }, [])}
    >
      <Stack spacing={2} mt={2}>
        <Typography variant="subtitle2">Head</Typography>
        <TextInput name="seo.title" label="Title" />
        <TextInput name="seo.description" label="Description" />
      </Stack>
    </CF>
  );
}
