import {
  Avatar,
  Button,
  Container,
  Flex,
  Heading,
  Skeleton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import Navigation from 'components/Navigation';
import NewProjectDialog from 'components/NewProjectDialog';
import SEO from 'components/SEO';
import Link from 'next/link';
import { useMyProjects } from 'store/projects';
import { protectedPage } from 'utils/auth';
import { slugify } from 'utils/url';

export default protectedPage(function Projects() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { myProjects, loading } = useMyProjects();

  return (
    <>
      <SEO title="All Projects" />
      <Navigation />
      <Container mt={4} maxW="container.lg">
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Heading size="sm" fontWeight={500}>
            All Projects
          </Heading>

          <Button size="sm" colorScheme="blue" onClick={onOpen}>
            New
          </Button>
        </Flex>

        {!loading && (
          <Stack>
            {myProjects.map((it) => (
              <ProjectItem key={it.id} id={it.id} name={it.name} />
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

function ProjectItem({ id, name }) {
  return (
    <Link href={`/dashboard/project/${slugify({ id, name })}`} passHref>
      <Button as="a" isFullWidth justifyContent="flex-start" height="unset" py={2}>
        <Avatar name="P" size="sm" mr={3} />

        {name}
      </Button>
    </Link>
  );
}
