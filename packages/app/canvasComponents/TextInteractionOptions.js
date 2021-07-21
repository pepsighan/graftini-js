import { zodResolver } from '@hookform/resolvers/zod';
import { InputAdornment, MenuItem, Stack, TextField, Typography } from '@material-ui/core';
import { useProjectId } from 'hooks/useProjectId';
import { useCallback } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useMyProject } from 'store/projects';
import { urlRegex } from 'utils/url';
import { z } from 'zod';
import CanvasForm from './form/CanvasForm';
import { wideLabelAlignmentStyle } from './form/formLabels';
import SelectInput from './form/SelectInput';
import useEnableContextMenu from './form/useEnableContextMenu';
import { setLinkWithHref, setLinkWithPageId, unsetLink } from './proseEditor/commands';
import { getInteractionFormFieldValuesFromSelection } from './proseEditor/formFields';
import { useProseEditor } from './proseEditor/ProseEditorContext';
import useCurrentSelectionId from './proseEditor/useCurrentSelectionId';
import useGetSelectionForForm from './proseEditor/useGetSelectionForForm';

const url = z.string().regex(urlRegex, { message: 'Not a valid URL. Starts with http or https.' });
const schema = z.object({
  link: z.object({
    href: url,
  }),
});

export default function TextInteractionOptions({ componentId }) {
  // Using the selection id for keying the form will refresh the form values that
  // reflect the current selection.
  const selectionId = useCurrentSelectionId(componentId);
  return <TextInteractionOptionsInner key={selectionId} componentId={componentId} />;
}

function TextInteractionOptionsInner({ componentId }) {
  const { getEditorView } = useProseEditor();
  const getSelection = useGetSelectionForForm(componentId);

  const onInitialize = useCallback(() => {
    return getInteractionFormFieldValuesFromSelection(getEditorView(), getSelection());
  }, [getEditorView, getSelection]);

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

  const { getEditorView } = useProseEditor();
  const getSelection = useGetSelectionForForm(componentId);

  const onDoNothing = useCallback(() => {
    const view = getEditorView();
    unsetLink(view, getSelection());
  }, [getEditorView, getSelection]);

  return (
    <>
      <Typography variant="subtitle2" mt={2} mb={0.5}>
        On Click
      </Typography>

      <SelectInput label="Action" name="link.action">
        <MenuItem value="" onClick={onDoNothing}>
          Do nothing
        </MenuItem>
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

  const { getEditorView } = useProseEditor();
  const getSelection = useGetSelectionForForm(componentId);

  const onSet = useCallback(
    (value) => {
      const view = getEditorView();
      setLinkWithPageId(value, view, getSelection());
    },
    [getEditorView, getSelection]
  );

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
            onSet(event.target.value);
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
            <MenuItem
              key={it.id}
              value={it.id}
              // If it selects the same apply it.
              onClick={it.id === field.value ? () => onSet(it.id) : null}
            >
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
  const onContextMenu = useEnableContextMenu();

  const { getEditorView } = useProseEditor();
  const getSelection = useGetSelectionForForm(componentId);

  const onSet = useCallback(
    (value) => {
      const view = getEditorView();
      setLinkWithHref(value, view, getSelection());
    },
    [getEditorView, getSelection]
  );

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
            // Only store is if a valid href.
            if (url.safeParse(href).success) {
              onSet(href);
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
          inputProps={{
            onContextMenu,
          }}
        />
      )}
    />
  );
}
