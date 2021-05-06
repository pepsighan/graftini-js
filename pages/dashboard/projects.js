import { Button, Container, Flex, Heading, Skeleton, Stack, useDisclosure } from '@chakra-ui/react';
import Navigation from 'components/Navigation';
import NewProjectDialog from 'components/NewProjectDialog';
import SEO from 'components/SEO';
import { useMyProjects } from 'store/projects';
import { protectedPage } from 'utils/auth';

export default protectedPage(function Projects() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { myProjects, loading } = useMyProjects();

  return (
    <>
      <SEO title="All Projects" />
      <Navigation />
      <Container mt={4} maxW="container.lg">
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Heading size="md">All Projects</Heading>

          <Button size="sm" colorScheme="blue" onClick={onOpen}>
            New
          </Button>
        </Flex>

        {!loading && (
          <Stack>
            {myProjects.map((it) => (
              <ProjectItem key={it.id} name={it.name} />
            ))}
          </Stack>
        )}
        {loading && (
          <Stack>
            <Skeleton height={8} />
            <Skeleton height={8} />
            <Skeleton height={8} />
          </Stack>
        )}
      </Container>

      <NewProjectDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
});

function ProjectItem({ name }) {
  return <Button isFullWidth>{name}</Button>;
}
