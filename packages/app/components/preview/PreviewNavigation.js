import { Box, Flex, Heading } from '@chakra-ui/react';
import BackButton from 'components/BackButton';
import { useRouter } from 'next/router';

export default function PreviewNavigation({ projectName }) {
  const { query } = useRouter();

  return (
    <Flex
      px={4}
      height="40px"
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top={0}
      backgroundColor="gray.50"
      borderBottom="1px"
      borderBottomColor="gray.200"
    >
      <BackButton href={`/dashboard/project/${query.projectId}`} />

      <Heading as="h6" size="xs">
        Preview - {projectName}
      </Heading>

      <Box />
    </Flex>
  );
}
