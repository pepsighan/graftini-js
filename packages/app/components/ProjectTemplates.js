import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import { FileIcon } from '@modulz/radix-icons';
import { useProjectTemplates } from 'store/templates';

export default function ProjectTemplates() {
  const { templates } = useProjectTemplates();

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
        {templates.map((template) => (
          <Grid key={template.id} item xs={4}>
            <Project template={template} />
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

function Project({ template }) {
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
        {template.name}
      </Typography>
    </Button>
  );
}
