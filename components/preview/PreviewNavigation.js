import { IconButton } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

export default function PreviewNavigation() {
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
      <Link href="/">
        <IconButton ml={4} size="sm" icon={<MdArrowBack />} />
      </Link>
    </Flex>
  );
}
