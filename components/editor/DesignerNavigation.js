import { Box, Button, Flex, IconButton, Text } from '@chakra-ui/react';
import { useCreateComponent } from '@graftini/graft';
import Link from 'next/link';
import { useCallback } from 'react';
import { CgScreen } from 'react-icons/cg';
import { MdArrowBack, MdCode, MdImportContacts } from 'react-icons/md';
import { useDesignerState } from 'store/designer';

function DrawButton({ mr, label, component }) {
  const ref = useCreateComponent({ type: component });

  return (
    <Button
      ref={ref}
      variant="outline"
      size="lg"
      sx={{ flexDirection: 'column', px: 3, color: 'gray.600', mr, width: '80px' }}
    >
      <MdImportContacts />
      <Text sx={{ fontSize: 'xs', fontWeight: 'normal', mt: 1 }}>{label}</Text>
    </Button>
  );
}

export default function EditorNavigation() {
  const toggleQueryBuilderPane = useDesignerState(
    useCallback((state) => state.toggleQueryBuilderPane, [])
  );

  return (
    <Flex
      py={2}
      px={4}
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top={0}
      backgroundColor="gray.50"
    >
      <Box>
        <Link href="/dashboard/projects">
          <IconButton icon={<MdArrowBack />} size="sm" />
        </Link>
      </Box>

      <Flex>
        <DrawButton mr={4} label="Container" component="Container" canvas />
        <DrawButton mr={4} label="Button" component="Button" />
        <DrawButton label="Text" component="Text" />
      </Flex>

      <Flex>
        <IconButton icon={<MdCode />} onClick={toggleQueryBuilderPane} />
        <Link href="/preview">
          <IconButton ml={4} icon={<CgScreen />} />
        </Link>
      </Flex>
    </Flex>
  );
}
