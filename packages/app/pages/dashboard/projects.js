import { Box, Button, Container, Grid, Stack, Typography, useTheme } from '@material-ui/core';
import { PlusIcon, TrashIcon, CubeIcon } from '@modulz/radix-icons';
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

      <Container sx={{ mt: 3 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
        >
          <Typography variant="subtitle1">All Projects</Typography>
          <Button variant="contained" size="small" onClick={on}>
            <PlusIcon /> <Box sx={{ ml: 0.5 }}>New</Box>
          </Button>
        </Box>

        {!loading && myProjects.length > 0 && (
          <Grid container spacing={4}>
            {myProjects.map((it) => (
              <Grid item key={it.id}>
                <ProjectItem id={it.id} name={it.name} />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && myProjects.length === 0 && (
          <>
            <Typography color="textSecondary">
              Your dashboard feels a bit lonely. Create a project by clicking on the <b>New</b>{' '}
              button on the top right.
            </Typography>
          </>
        )}

        <Stack alignItems="center" sx={{ mt: 12 }}>
          <Box
            sx={{
              width: {
                xs: 300,
                sm: 400,
                md: 500,
              },
              height: {
                xs: 200,
                sm: 250,
                md: 300,
              },
              bgcolor: 'grey.200',
              mt: 4,
              borderRadius: 1,
            }}
          >
            This is a youtube video that showcases how its used.
            {/* Here would be a video of how we deploy the app in 10 minutes. */}
          </Box>
        </Stack>
      </Container>

      <NewProjectDialog isOpen={isOpen} onClose={off} />
    </>
  );
});

function ProjectItem({ id, name }) {
  const link = `/dashboard/project/${slugify({ id, name })}`;
  const { palette } = useTheme();

  return (
    <Box sx={{ width: 300 }}>
      <Link href={link} color="inherit">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'grey.200',
            width: 300,
            height: 200,
            textDecoration: 'none',
            borderRadius: 2,
          }}
        >
          <CubeIcon width={64} height={64} color={palette.grey[300]} />
        </Box>
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
