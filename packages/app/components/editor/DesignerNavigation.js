import {
  useCreateComponent,
  useCreateComponentStore,
  useForgetCreateComponent,
} from '@graftini/graft';
import { AppBar, IconButton, Stack, Toolbar, Tooltip } from '@material-ui/core';
import { CursorArrowIcon, PlayIcon, SquareIcon, TextIcon } from '@modulz/radix-icons';
import BackButton from 'components/BackButton';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import DeployButton from './DeployButton';

export default function EditorNavigation() {
  const { query } = useRouter();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'grey.400',
      }}
    >
      <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
        <BackButton href="/dashboard/projects" />

        <Stack direction="row" spacing={2}>
          <CursorButton />
          <DrawButton
            mr={4}
            label="Box"
            component="Box"
            icon={<SquareIcon />}
            isCanvas
            childAppendDirection="vertical"
          />
          <DrawButton label="Text" component="Text" icon={<TextIcon />} />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Tooltip title="Preview">
            <Link href={`/dashboard/project/${query.projectId}/preview`}>
              <IconButton>
                <PlayIcon />
              </IconButton>
            </Link>
          </Tooltip>

          <DeployButton />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function CursorButton() {
  const isNoCreate = useCreateComponentStore(useCallback((state) => !state.newComponent, []));
  const forgetCreateComponent = useForgetCreateComponent();

  return (
    <Tooltip title="Cursor">
      <IconButton
        color={isNoCreate ? 'primary' : 'drawButton'}
        sx={{ flexDirection: 'column' }}
        onClick={forgetCreateComponent}
      >
        <CursorArrowIcon />
      </IconButton>
    </Tooltip>
  );
}

function DrawButton({ label, icon, component, isCanvas, childAppendDirection }) {
  const activeType = useCreateComponentStore(useCallback((state) => state.newComponent?.type, []));

  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));
  const onCreate = useCreateComponent({
    type: component,
    isCanvas,
    childAppendDirection,
    // Transform the drawn size to the one usable by the box.
    transformSize: (width, height) => ({
      width: {
        size: width,
        unit: 'px',
      },
      height: {
        size: height,
        unit: 'px',
      },
    }),
  });

  const onClick = useCallback(
    (event) => {
      onCreate(event);
      unselectComponent();
    },
    [onCreate, unselectComponent]
  );

  return (
    <Tooltip title={label}>
      <IconButton
        color={activeType === component ? 'primary' : 'drawButton'}
        sx={{ flexDirection: 'column' }}
        onClick={onClick}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}
