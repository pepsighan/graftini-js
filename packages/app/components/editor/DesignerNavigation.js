import { Box, Button, Flex, Icon, IconButton, Text } from '@chakra-ui/react';
import BackButton from 'components/BackButton';
import { motion } from 'framer-motion';
import { useCreateComponent } from 'graft';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { MdCode } from 'react-icons/md';
import { useDesignerState } from 'store/designer';
import theme from 'utils/theme';

function DrawButton({ mr, label, icon, component, isCanvas, childAppendDirection }) {
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
      style={{
        color: theme.colors.gray[800],
        '--icon-color': theme.colors.gray[600],
      }}
      whileHover={{
        color: theme.colors.primary[700],
        '--icon-color': theme.colors.primary[500],
      }}
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
        <IconButton icon={<Icon as={MdCode} fontSize="xl" />} onClick={toggleQueryBuilderPane} />
        {/* <Link href={`/dashboard/project/${query.projectId}/preview`}>
          <IconButton ml={4} icon={<Icon as={CgScreen} fontSize="xl" />} />
        </Link> */}
      </Flex>
    </Flex>
  );
}
