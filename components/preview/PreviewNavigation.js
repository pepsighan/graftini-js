import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdArrowBack } from 'react-icons/md';

export default function PreviewNavigation({ projectName }) {
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
      borderBottom="1px"
      borderBottomColor="gray.200"
    >
      <Link href={`/dashboard/project/${query.projectId}`}>
        <IconButton ml={4} size="sm" icon={<MdArrowBack />} />
      </Link>

      <Heading as="h6" size="xs">
        Preview - {projectName}
      </Heading>

      <Box />
    </Flex>
  );
}
