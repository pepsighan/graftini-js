import { useEditorStore } from '@graftini/graft';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, MenuItem, Stack, Typography } from '@material-ui/core';
import { useProjectId } from 'hooks/useProjectId';
import useTextSelectionId, { getTextSelectionForComponent } from 'hooks/useTextSelectionId';
import { useCallback } from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { useMyProject } from 'store/projects';
import { z } from 'zod';
import CanvasForm from './form/CanvasForm';
import SelectInput from './form/SelectInput';
import TextInput from './form/TextInput';

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
        <OnClick />
      </Stack>
    </CanvasForm>
  );
}

function OnClick() {
  const { control } = useFormContext();
  const { errors } = useFormState({ control });
  const action = useWatch({ control, name: 'link.action' });

  const { project } = useMyProject({ projectId: useProjectId() });

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

      {action === 'pageId' && (
        <SelectInput label="Page" name="link.pageId">
          {project.pages.map((it) => (
            <MenuItem key={it.id} value={it.id}>
              {it.name}
            </MenuItem>
          ))}
        </SelectInput>
      )}

      {action === 'href' && (
        <TextInput
          label="Link"
          name="link.href"
          error={!!errors.link?.href}
          helperText={errors.link?.href?.message}
        />
      )}
    </>
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
