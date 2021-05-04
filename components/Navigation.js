import { Button, Flex, Text } from '@chakra-ui/react';

export default function Navigation() {
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
      <Text fontWeight="bold">Nocodepress</Text>
      <Button colorScheme="blue">Login</Button>
    </Flex>
  );
}
