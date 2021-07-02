import { AppBar, Box, Toolbar, Typography } from '@material-ui/core';
import BackButton from 'components/BackButton';
import { useRouter } from 'next/router';
import { navBarHeight } from 'utils/constants';

export default function PreviewNavigation({ projectName }) {
  const { query } = useRouter();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'grey.400',
        height: navBarHeight,
      }}
    >
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
