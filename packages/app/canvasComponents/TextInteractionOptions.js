import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItem, Stack, Typography } from '@material-ui/core';
import { useCallback } from 'react';
import { z } from 'zod';
import CanvasForm from './form/CanvasForm';
import SelectInput from './form/SelectInput';

const url = z.string().regex(
  // eslint-disable-next-line no-useless-escape
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  { message: 'Not a valid URL. Starts with http or https.' }
);

const schema = z.object({
  link: z.object({
    href: url,
  }),
});

export default function TextInteractionOptions({ componentId }) {
  const onInitialize = useCallback(
    () => ({
      action: '',
    }),
    []
  );

  const onSync = useCallback((props, state) => {}, []);

  return (
    <CanvasForm
      componentId={componentId}
      onInitialize={onInitialize}
      resolver={zodResolver(schema)}
      onSync={onSync}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle2" mt={2} mb={0.5}>
          On Click
        </Typography>
        <SelectInput label="Action" name="action">
          <MenuItem value="">Do nothing</MenuItem>
          <MenuItem value="pageId">Go to page</MenuItem>
          <MenuItem value="href">Open external link</MenuItem>
        </SelectInput>
      </Stack>
    </CanvasForm>
  );
}
