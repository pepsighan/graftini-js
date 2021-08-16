import {
  useCreateComponent,
  useCreateComponentStore,
  useForgetCreateComponent,
} from '@graftini/graft';
import { AppBar, IconButton, Stack, Toolbar, Tooltip } from '@material-ui/core';
import { CursorArrowIcon, PlayIcon, PlusIcon, SquareIcon, TextIcon } from '@modulz/radix-icons';
import GraftiniLogo from 'components/GraftiniLogo';
import useBoolean from 'hooks/useBoolean';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import ComponentDialog from './componentDialog/ComponentDialog';
import DeployButton from './DeployButton';
import HamburgerButton from './HamburgerButton';
import SavingStatus from './SavingStatus';

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
          <PlusButton />
          <CursorButton />
          <DrawButton
            mr={4}
            label="Box"
            component="Box"
            icon={<SquareIcon width={16} height={16} />}
            isCanvas
            childAppendDirection="vertical"
          />
          <DrawButton label="Text" component="Text" icon={<TextIcon width={16} height={16} />} />
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ flex: 1 }}>
          <SavingStatus />

          <Link href={`/dashboard/project/${query.projectId}/preview`}>
            <Tooltip title="Preview">
              <IconButton>
                <PlayIcon />
              </IconButton>
            </Tooltip>
          </Link>

          <DeployButton />

          <HamburgerButton />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function PlusButton() {
  const [open, { on, off }] = useBoolean();

  return (
    <>
      <Tooltip title="Components" onClick={on}>
        <IconButton sx={{ flexDirection: 'column' }}>
          <PlusIcon width={18} height={18} />
        </IconButton>
      </Tooltip>

      <ComponentDialog open={open} onClose={off} />
    </>
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
        <CursorArrowIcon width={16} height={16} />
      </IconButton>
    </Tooltip>
  );
}

function DrawButton({ label, icon, component, isCanvas, childAppendDirection }) {
  const activeType = useCreateComponentStore(useCallback((state) => state.newComponent?.type, []));

  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));

  const onCreate = useCreateComponent({
    variant: 'basic',
    type: component,
    isCanvas,
    childAppendDirection,
    // Transform the drawn size to the one usable by the box and text.
    transformSize: (width, height) => {
      switch (component) {
        case 'Text':
          let widthSize = { size: 100, unit: '%' };
          if (width >= 40) {
            widthSize = { size: width, unit: 'px' };
          }

          let heightSize = 'auto';
          if (height >= 18) {
            heightSize = { size: height, unit: 'px' };
          }

          return {
            width: widthSize,
            height: heightSize,
          };

        case 'Box':
        default:
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
