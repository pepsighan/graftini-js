import { Button, Container, Flex, Heading, Skeleton, Stack } from '@chakra-ui/react';
import Navigation from 'components/Navigation';
import { useMyProjects } from 'store/projects';
import { protectedPage } from 'utils/auth';

export default protectedPage(function Projects() {
  const { myProjects, loading } = useMyProjects();

  return (
    <>
      <Navigation />

      <Container mt={4} maxW="container.lg">
        <Flex alignItems="center" justifyContent="space-between">
          <Heading size="md" mb={4}>
            All Projects
          </Heading>

          <Button size="sm" colorScheme="blue">
            New
          </Button>
        </Flex>

        {!loading && myProjects.map((it) => <ProjectItem key={it.id} name={it.name} />)}
        {loading && (
          <Stack>
            <Skeleton height={8} />
            <Skeleton height={8} />
            <Skeleton height={8} />
          </Stack>
        )}
      </Container>
    </>
  );
});

function ProjectItem({ name }) {
  return <Button>{name}</Button>;
}
