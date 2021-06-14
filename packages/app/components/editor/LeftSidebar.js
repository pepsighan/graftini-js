import { Flex } from '@chakra-ui/react';
import Layers from './Layers';
import Pages from './Pages';

export default function LeftSidebar() {
  return (
    <Flex
      py={4}
      width={300}
      bg="gray.100"
      borderRight="1px"
      borderRightColor="gray.400"
      flexDirection="column"
    >
      <Pages />
      <Layers />
    </Flex>
  );
}
