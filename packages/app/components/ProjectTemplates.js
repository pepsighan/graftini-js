import { Box, Grid, Paper, Typography } from '@material-ui/core';

export default function ProjectTemplates() {
  return (
    <Box>
      <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
        Kick start your project with a template that suits your needs. If you want a clean slate,
        start from scratch.
      </Typography>

      <Grid container spacing={2}>
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Grid key={index} item xs={4}>
              <Paper sx={{ bg: 'grey.200', height: 200 }} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
