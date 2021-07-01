import { AppBar, Toolbar, Typography, Box } from '@material-ui/core';
import BackButton from 'components/BackButton';
import { useRouter } from 'next/router';

export default function PreviewNavigation({ projectName }) {
  const { query } = useRouter();

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
        <BackButton href={`/dashboard/project/${query.projectId}`} />
        <Typography variant="subtitle2" color="textSecondary">
          Preview - {projectName}
        </Typography>
        <Box />
      </Toolbar>
    </AppBar>
  );
}
