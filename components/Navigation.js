import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/react';
import { MdImportContacts } from 'react-icons/md';

function DrawButton({ mr }) {
  return (
    <Button
      variant="outline"
      size="lg"
      sx={{ flexDirection: 'column', px: 3, color: 'gray.600', mr }}
    >
      <MdImportContacts />
      <Text sx={{ fontSize: 'xs', fontWeight: 'normal', mt: 1 }}>Container</Text>
    </Button>
  );
}

export default function Navigation() {
  return (
    <Flex sx={{ py: 2, px: 4, justifyContent: 'center', backgroundColor: 'gray.50' }}>
      <DrawButton mr={4} />
      <DrawButton />
    </Flex>
  );
}
