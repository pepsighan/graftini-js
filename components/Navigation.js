import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/react';
import { MdImportContacts } from 'react-icons/md';

function DrawButton({ mr, label }) {
  return (
    <Button
      variant="outline"
      size="lg"
      sx={{ flexDirection: 'column', px: 3, color: 'gray.600', mr, width: '80px' }}
    >
      <MdImportContacts />
      <Text sx={{ fontSize: 'xs', fontWeight: 'normal', mt: 1 }}>{label}</Text>
    </Button>
  );
}

export default function Navigation() {
  return (
    <Flex sx={{ py: 2, px: 4, justifyContent: 'center', backgroundColor: 'gray.50' }}>
      <DrawButton mr={4} label="Container" />
      <DrawButton mr={4} label="Text" />
      <DrawButton label="Button" />
    </Flex>
  );
}
