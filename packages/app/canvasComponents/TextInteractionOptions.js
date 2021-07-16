import { zodResolver } from '@hookform/resolvers/zod';
import { InputAdornment, MenuItem, Stack, TextField, Typography } from '@material-ui/core';
import { useProjectId } from 'hooks/useProjectId';
import { useForm } from 'react-hook-form';
import { useMyProject } from 'store/projects';
import { z } from 'zod';
import { wideLabelAlignmentStyle } from './form/formLabels';

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
  const {
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const action = 'pageId';
  const { project } = useMyProject({ projectId: useProjectId() });

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" mt={2} mb={0.5}>
        On Click
      </Typography>
      <TextField
        select
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
              <Typography variant="body2">Action</Typography>
            </InputAdornment>
          ),
        }}
      >
        <MenuItem value="">Do nothing</MenuItem>
        <MenuItem value="pageId">Go to page</MenuItem>
        <MenuItem value="href">Open external link</MenuItem>
      </TextField>
      {action === 'pageId' && (
        <TextField
          select
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
                <Typography variant="body2">Page</Typography>
              </InputAdornment>
            ),
          }}
        >
          {project.pages.map((it) => (
            <MenuItem key={it.id} value={it.id}>
              {it.name}
            </MenuItem>
          ))}
        </TextField>
      )}
      {action === 'href' && (
        <TextField
          error={!!errors.link?.href}
          helperText={errors.link?.href?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
                <Typography variant="body2">Link</Typography>
              </InputAdornment>
            ),
          }}
        />
      )}
    </Stack>
  );
}
