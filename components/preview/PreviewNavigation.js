import { IconButton } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdArrowBack } from 'react-icons/md';

export default function PreviewNavigation() {
  const { query } = useRouter();

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
      <Link href={`/dashboard/project/${query.projectId}`}>
        <IconButton ml={4} size="sm" icon={<MdArrowBack />} />
      </Link>
    </Flex>
  );
}
