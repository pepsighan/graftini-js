import { Box, Text, Stack } from '@chakra-ui/react';
import { ROOT_NODE_ID } from '@graftini/graft';
import CanvasForm from 'canvasComponents/form/CanvasForm';
import TextInput from 'canvasComponents/form/TextInput';
import { useCallback, useEffect } from 'react';
import { useDesignerState } from 'store/designer';
import SelectInput from 'canvasComponents/form/SelectInput';
import { useFormContext, useWatch } from 'react-hook-form';
import { useMyProject } from 'store/projects';
import { useProjectId } from 'hooks/useProjectId';

export default function InteractionOptions() {
  const selectedComponentId = useDesignerState(
    useCallback((state) => state.selectedComponentId, [])
  );

  const type = useDesignerState(
    useCallback((state) => {
      if (state.selectedComponentId === ROOT_NODE_ID) {
        return 'Root';
      }

      return state.selectedComponentId
        ? state.pages[state.currentOpenPage]?.[state.selectedComponentId]?.type ?? null
        : null;
    }, [])
  );

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
      (state.link.action === 'href' && !state.link.href)
    ) {
      props.link = null;
      return;
    }

    props.link ??= {};
    props.link.pageId = state.link.pageId;
    props.link.href = state.link.pageId ? null : state.link.href;
  }, []);

  if (!selectedComponentId || type === 'Root') {
    return (
      <Box px={3} py={2} bg="gray.200" borderRadius="md">
        <Text fontSize="sm">Select a component from the canvas to view options.</Text>
      </Box>
    );
  }

  if (type !== 'Box') {
    return (
      <Box px={3} py={2} bg="gray.200" borderRadius="md">
        <Text fontSize="sm">Select a box from the canvas to view options.</Text>
      </Box>
    );
  }

  return (
    <CanvasForm componentId={selectedComponentId} onInitialize={onInitialize} onSync={onSync}>
      <Stack spacing={4}>
        <OnClick />
      </Stack>
    </CanvasForm>
  );
}

function OnClick() {
  const { control } = useFormContext();
  const action = useWatch({ control, name: 'link.action' });

  const { project } = useMyProject({ projectId: useProjectId() });

  return (
    <>
      <Text fontSize="sm" fontWeight="bold" mb={1}>
        On Click
      </Text>

      <SelectInput label="Action" name="link.action" labelWidth="16">
        <option value="">Do nothing</option>
        <option value="pageId">Go to page</option>
        <option value="href">Open external link</option>
      </SelectInput>

      {action === 'pageId' && (
        <SelectInput label="Page" name="link.pageId" labelWidth="16">
          {project.pages.map((it) => (
            <option key={it.id} value={it.id}>
              {it.name}
            </option>
          ))}
        </SelectInput>
      )}

      {action === 'href' && <TextInput label="Link" name="link.href" labelWidth="16" />}
    </>
  );
}
