import { useEditorStore } from '@graftini/graft';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, InputAdornment, MenuItem, Stack, TextField, Typography } from '@material-ui/core';
import { useProjectId } from 'hooks/useProjectId';
import useTextSelectionId, { getTextSelectionForComponent } from 'hooks/useTextSelectionId';
import { useCallback } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useMyProject } from 'store/projects';
import { urlRegex } from 'utils/url';
import { z } from 'zod';
import CanvasForm from './form/CanvasForm';
import { wideLabelAlignmentStyle } from './form/formLabels';
import SelectInput from './form/SelectInput';
import { applyLink } from './textEditor/entities';
import { useResolveCurrentSelection } from './textEditor/textSelection';
import { useTextEditorStateSetter } from './textEditor/useTextEditorState';

const url = z.string().regex(urlRegex, { message: 'Not a valid URL. Starts with http or https.' });
const schema = z.object({
  link: z.object({
    href: url,
  }),
});

export default function TextInteractionOptions({ componentId }) {
  // Using the selection id for keying the form will refresh the form values that
  // reflect the current selection.
  const textSelectionId = useTextSelectionId(componentId);
  const isTextSelected = useIsTextSelected(componentId);

  if (!isTextSelected) {
    return (
      <Box mt={2}>
        <Typography variant="body2">
          Select a portion of a text to configure interactions.
        </Typography>
      </Box>
    );
  }

  return <TextInteractionOptionsInner key={textSelectionId} componentId={componentId} />;
}

function TextInteractionOptionsInner({ componentId }) {
  const onInitialize = useCallback(() => {
    return {
      link: {
        action: '',
        pageId: '',
        href: '',
      },
    };
  }, []);

  return (
    <CanvasForm
      componentId={componentId}
      onInitialize={onInitialize}
      resolver={zodResolver(schema)}
    >
      <Stack spacing={1}>
        <OnClick componentId={componentId} />
      </Stack>
    </CanvasForm>
  );
}

function OnClick({ componentId }) {
  const { control } = useFormContext();
  const action = useWatch({ control, name: 'link.action' });

  return (
    <>
      <Typography variant="subtitle2" mt={2} mb={0.5}>
        On Click
      </Typography>

      <SelectInput label="Action" name="link.action">
        <MenuItem value="">Do nothing</MenuItem>
        <MenuItem value="pageId">Go to page</MenuItem>
        <MenuItem value="href">Open external link</MenuItem>
      </SelectInput>

      {action === 'pageId' && <PageSelection componentId={componentId} />}
      {action === 'href' && <HrefInput componentId={componentId} />}
    </>
  );
}

function PageSelection({ componentId }) {
  const { project } = useMyProject({ projectId: useProjectId() });
  const { control } = useFormContext();
  const editorSetter = useTextEditorStateSetter();
  const resolveCurrentSelection = useResolveCurrentSelection({ componentId });

  return (
    <Controller
      name="link.pageId"
      control={control}
      render={({ field }) => (
        <TextField
          select
          name={field.name}
          value={field.value}
          onChange={(event) => {
            field.onChange(event);

            const pageId = event.target.value;
            if (pageId) {
              const selection = resolveCurrentSelection();
              editorSetter((state) => applyLink(state, { pageId }, selection));
            }
          }}
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
    />
  );
}

function HrefInput({ componentId }) {
  const { control } = useFormContext();
  const editorSetter = useTextEditorStateSetter();
  const resolveCurrentSelection = useResolveCurrentSelection({ componentId });

  return (
    <Controller
      name="link.href"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          name={field.name}
          value={field.value}
          onChange={(event) => {
            field.onChange(event);

            const href = event.target.value;
            const { success } = url.safeParse(href);
            if (success) {
              const selection = resolveCurrentSelection();
              editorSetter((state) => applyLink(state, { href }, selection));
            }
          }}
          error={!!error}
          helperText={error?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
                <Typography variant="body2">Link</Typography>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}

function useIsTextSelected(componentId) {
  return useEditorStore(
    useCallback(
      (state) => {
        const selection = getTextSelectionForComponent(state.componentMap, componentId);
        return !selection.isCollapsed();
      },
      [componentId]
    )
  );
}
