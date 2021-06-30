import { Box, Button, Container, Stack, Typography } from '@material-ui/core';
import { TrashIcon, PlusIcon } from '@modulz/radix-icons';
import DeleteProjectConfirmation from 'components/DeleteProjectConfirmation';
import Link from 'components/Link';
import Navigation from 'components/Navigation';
import NewProjectDialog from 'components/NewProjectDialog';
import SEO from 'components/SEO';
import useBoolean from 'hooks/useBoolean';
import { useMyProjects } from 'store/projects';
import { protectedPage } from 'utils/auth';
import { slugify } from 'utils/url';

export default protectedPage(function Projects() {
  const [isOpen, { on, off }] = useBoolean();
  const { myProjects, loading } = useMyProjects();

  return (
    <>
      <SEO title="All Projects" />
      <Navigation />

      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2">All Projects</Typography>
          <Button variant="contained" size="small" onClick={on}>
            <PlusIcon /> <Box sx={{ ml: 0.5 }}>New</Box>
          </Button>
        </Box>

        {!loading && (
          <Stack mt={2}>
            {myProjects.map((it) => (
              <ProjectItem key={it.id} id={it.id} name={it.name} />
            ))}
          </Stack>
        )}
      </Container>

      <NewProjectDialog isOpen={isOpen} onClose={off} />
    </>
  );
});

function ProjectItem({ id, name }) {
  const link = `/dashboard/project/${slugify({ id, name })}`;

  return (
    <Box sx={{ width: 300 }}>
      <Link href={link} color="inherit">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'grey.200',
            width: 300,
            height: 200,
            textDecoration: 'none',
            borderRadius: 2,
          }}
        ></Box>
      </Link>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Link href={link} variant="subtitle2" sx={{ flex: 1, color: 'inherit' }}>
          {name}
        </Link>

        <DeleteProjectConfirmation
          projectId={id}
          borderTopLeftRadius="none"
          borderBottomLeftRadius="none"
          height="unset"
          py={2}
        >
          <TrashIcon />
        </DeleteProjectConfirmation>
      </Box>
    </Box>
  );
}
