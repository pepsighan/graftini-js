import { Box, Button, Flex, IconButton, Text } from '@chakra-ui/react';
import { mdiCodeJson, mdiCursorDefault, mdiFullscreen } from '@mdi/js';
import BackButton from 'components/BackButton';
import MdIcon from 'components/Icon';
import { motion } from 'framer-motion';
import { useCreateComponent, useCurrentCreateComponentType, useForgetCreateComponent } from 'graft';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

export default function EditorNavigation() {
  const { query } = useRouter();

  const toggleQueryBuilderPane = useDesignerState(
    useCallback((state) => state.toggleQueryBuilderPane, [])
  );

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
          icon={<BoxIcon />}
          isCanvas
          childAppendDirection="vertical"
        />
        <DrawButton label="Text" component="Text" icon={<TextIcon />} />
      </Flex>

      <Flex>
        <IconButton
          icon={<MdIcon icon={mdiCodeJson} fontSize="xl" />}
          onClick={toggleQueryBuilderPane}
        />
        <Link href={`/dashboard/project/${query.projectId}/preview`}>
          <IconButton ml={4} icon={<MdIcon icon={mdiFullscreen} fontSize="xl" />} />
        </Link>
      </Flex>
    </Flex>
  );
}

function CursorButton() {
  const selectedComponent = useCurrentCreateComponentType();
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
      animate={!selectedComponent ? 'active' : 'inactive'}
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
        <MdIcon icon={mdiCursorDefault} fontSize="xl" color="var(--icon-color)" height={5} />
        <Text fontSize="sm" fontWeight="normal" mt={1.5}>
          Cursor
        </Text>
      </Button>
    </motion.div>
  );
}

function DrawButton({ mr, label, icon, component, isCanvas, childAppendDirection }) {
  const selectedComponent = useCurrentCreateComponentType();

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
      animate={selectedComponent === component ? 'active' : 'inactive'}
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

function BoxIcon() {
  return <Box width={5} height={5} bg="var(--icon-color)" borderRadius="sm" />;
}

function TextIcon() {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width={5}
      height={5}
      bg="var(--icon-color)"
      borderRadius="sm"
      color="white"
      fontSize="sm"
      pointerEvents="none"
    >
      A
    </Flex>
  );
}
