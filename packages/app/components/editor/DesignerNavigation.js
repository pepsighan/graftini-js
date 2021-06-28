import { Box, Button, Flex, IconButton, Text, Tooltip } from '@chakra-ui/react';
import {
  useCreateComponent,
  useCreateComponentStore,
  useForgetCreateComponent,
} from '@graftini/graft';
import { CursorArrowIcon, PlayIcon, SquareIcon, TextIcon } from '@modulz/radix-icons';
import BackButton from 'components/BackButton';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';
import DeployButton from './DeployButton';

export default function EditorNavigation() {
  const { query, push } = useRouter();

  return (
    <Flex
      height="54px"
      px={4}
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top={0}
      backgroundColor="gray.100"
      borderBottom="1px"
      borderBottomColor="gray.400"
    >
      <Box>
        <BackButton href="/dashboard/projects" />
      </Box>

      <Flex>
        <CursorButton />
        <DrawButton
          mr={4}
          label="Box"
          component="Box"
          icon={<SquareIcon color="var(--icon-color)" />}
          isCanvas
          childAppendDirection="vertical"
        />
        <DrawButton label="Text" component="Text" icon={<TextIcon color="var(--icon-color)" />} />
      </Flex>

      <Flex>
        <Tooltip label="Preview">
          <IconButton
            ml={4}
            icon={<PlayIcon width={20} height={20} />}
            onClick={useCallback(
              () => push(`/dashboard/project/${query.projectId}/preview`),
              [push, query.projectId]
            )}
          />
        </Tooltip>

        <DeployButton />
      </Flex>
    </Flex>
  );
}

function CursorButton() {
  const isNoCreate = useCreateComponentStore(useCallback((state) => !state.newComponent, []));
  const forgetCreateComponent = useForgetCreateComponent();

  return (
    <motion.div
      variants={{
        active: {
          color: theme.colors.primary[600],
          '--icon-color': theme.colors.primary[500],
        },
        inactive: {
          color: theme.colors.gray[800],
          '--icon-color': theme.colors.gray[600],
        },
      }}
      animate={isNoCreate ? 'active' : 'inactive'}
      whileHover="active"
    >
      <Button
        size="lg"
        variant="ghost"
        flexDirection="column"
        px={3}
        mr={4}
        width="70px"
        onClick={forgetCreateComponent}
      >
        <CursorArrowIcon color="var(--icon-color)" />
        <Text fontSize="sm" fontWeight="normal" mt={1.5}>
          Cursor
        </Text>
      </Button>
    </motion.div>
  );
}

function DrawButton({ mr, label, icon, component, isCanvas, childAppendDirection }) {
  const createComponentType = useCreateComponentStore(
    useCallback((state) => state.newComponent?.type, [])
  );

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
    <motion.div
      variants={{
        active: {
          color: theme.colors.primary[600],
          '--icon-color': theme.colors.primary[500],
        },
        inactive: {
          color: theme.colors.gray[800],
          '--icon-color': theme.colors.gray[600],
        },
      }}
      animate={createComponentType === component ? 'active' : 'inactive'}
      whileHover="active"
    >
      <Button
        size="lg"
        variant="ghost"
        flexDirection="column"
        px={3}
        mr={mr}
        width="70px"
        onClick={onClick}
      >
        {icon}
        <Text fontSize="sm" fontWeight="normal" mt={1.5}>
          {label}
        </Text>
      </Button>
    </motion.div>
  );
}
