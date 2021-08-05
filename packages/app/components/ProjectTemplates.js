import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import { FileIcon } from '@modulz/radix-icons';

export default function ProjectTemplates() {
  return (
    <Box>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        Kick start your project with a template that suits your needs. If you want a clean slate,
        start from scratch.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <BlankProject />
        </Grid>
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Grid key={index} item xs={4}>
              <Project />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}

function BlankProject() {
  return (
    <Button sx={{ flexDirection: 'column', width: '100%', p: 0 }}>
      <Paper
        sx={{
          height: 200,
          bgcolor: 'grey.100',
          color: 'grey.400',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <FileIcon width={64} height={64} />
      </Paper>
      <Typography variant="subtitle2" sx={{ px: 1, py: 0.5 }}>
        Blank
      </Typography>
    </Button>
  );
}

function Project() {
  return (
    <Button sx={{ flexDirection: 'column', width: '100%', p: 0 }}>
      <Paper
        sx={{
          height: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      />
      <Typography variant="subtitle2" sx={{ px: 1, py: 0.5 }}>
        Portfolio
      </Typography>
    </Button>
  );
}
