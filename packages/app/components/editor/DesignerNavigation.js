import {
  useCreateComponent,
  useCreateComponentStore,
  useForgetCreateComponent,
} from '@graftini/graft';
import { AppBar, IconButton, Stack, Toolbar, Tooltip } from '@material-ui/core';
import { CursorArrowIcon, PlayIcon, SquareIcon, TextIcon } from '@modulz/radix-icons';
import GraftiniLogo from 'components/GraftiniLogo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import DeployButton from './DeployButton';
import SavingStatus from './SavingStatus';
import ShortcutsButton from './ShortcutsButton';

export default function EditorNavigation() {
  const { query } = useRouter();

  return (
    <AppBar sx={{ backgroundColor: 'grey.50' }}>
      <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
        <Stack alignItems="flex-start" sx={{ flex: 1 }}>
          <Link href="/dashboard/projects" passHref>
            <IconButton component="a" color="inherit">
              <GraftiniLogo />
            </IconButton>
          </Link>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ flex: 1 }}>
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

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ flex: 1 }}>
          <ShortcutsButton />

          <SavingStatus />

          <Link href={`/dashboard/project/${query.projectId}/preview`}>
            <Tooltip title="Preview">
              <IconButton>
                <PlayIcon />
              </IconButton>
            </Tooltip>
          </Link>

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

  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));

  const onCreate = useCreateComponent({
    type: component,
    isCanvas,
    childAppendDirection,
    // Transform the drawn size to the one usable by the box.
    transformSize: (width, height) => {
      if (component === 'Box') {
        return {
          width: {
            size: width,
            unit: 'px',
          },
          height: {
            size: height,
            unit: 'px',
          },
        };
      }

      // No need to add width and height for Text.
      return {};
    },
    // Select the component which was just created.
    onCreate: (componentId) => {
      // The component is not selected if done immediately. The parent was
      // getting selected.
      setTimeout(() => {
        selectComponent(componentId);
      });
    },
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
