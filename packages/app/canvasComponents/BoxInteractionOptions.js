import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItem, Stack, Typography } from '@material-ui/core';
import CanvasForm from 'canvasComponents/form/CanvasForm';
import SelectInput from 'canvasComponents/form/SelectInput';
import TextInput from 'canvasComponents/form/TextInput';
import { useProjectId } from 'hooks/useProjectId';
import { useCallback } from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { useMyProject } from 'store/projects';
import { urlRegex } from 'utils/url';
import { z } from 'zod';

const url = z.string().regex(urlRegex, { message: 'Not a valid URL. Starts with http or https.' });

const schema = z.object({
  link: z.object({
    href: url,
  }),
});

export default function BoxInteractionOptions({ componentId }) {
  const onInitialize = useCallback((props) => {
    let action = '';
    if (props.link?.href) {
      action = 'href';
    } else if (props.link?.pageId) {
      action = 'pageId';
    }

    return {
      link: props.link
        ? {
            pageId: props.link.pageId,
            href: props.link.href,
            action,
          }
        : null,
    };
  }, []);

  const onSync = useCallback((props, state) => {
    if (
      !state.link ||
      !state.link.action ||
      (state.link.action === 'pageId' && !state.link.pageId) ||
      (state.link.action === 'href' && !isUrl(state.link.href))
    ) {
      props.link = null;
      return;
    }

    props.link ??= {};
    props.link.pageId = state.link.action === 'pageId' ? state.link.pageId : null;
    props.link.href = state.link.action === 'href' ? state.link.href : null;
  }, []);

  return (
    <CanvasForm
      componentId={componentId}
      resolver={zodResolver(schema)}
      onInitialize={onInitialize}
      onSync={onSync}
    >
      <Stack spacing={1}>
        <OnClick />
      </Stack>
    </CanvasForm>
  );
}

function isUrl(value) {
  try {
    url.parse(value);
    return true;
  } catch (_) {
    return false;
  }
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
