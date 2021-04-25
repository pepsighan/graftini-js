import { Button, Text, useDisclosure } from '@chakra-ui/react';
import QueryBuilderDialog from './graphqlQuery/QueryBuilderDialog';

export default function Queries() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text fontWeight="bold" mb={2}>
        Queries
      </Text>

      <Button onClick={onOpen}>New Query</Button>
      <QueryBuilderDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
}
