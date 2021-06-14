import {
  Avatar,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  Skeleton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { mdiDelete } from '@mdi/js';
import DeleteProjectConfirmation from 'components/DeleteProjectConfirmation';
import Icon from 'components/Icon';
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
          <Heading size="sm" fontWeight="bold">
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
    <ButtonGroup isAttached>
      <Link href={`/dashboard/project/${slugify({ id, name })}`} passHref>
        <Button
          as="a"
          isFullWidth
          justifyContent="space-between"
          height="unset"
          py={2}
          fontWeight="normal"
          borderTopRightRadius="none"
          borderBottomRightRadius="none"
        >
          <Flex alignItems="center">
            <Avatar name="P" size="sm" mr={3} />
            {name}
          </Flex>
        </Button>
      </Link>

      <DeleteProjectConfirmation
        projectId={id}
        borderTopLeftRadius="none"
        borderBottomLeftRadius="none"
        height="unset"
        py={2}
      >
        <Icon icon={mdiDelete} fontSize="2xl" />
      </DeleteProjectConfirmation>
    </ButtonGroup>
  );
}
