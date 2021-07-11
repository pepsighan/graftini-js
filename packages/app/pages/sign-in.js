import {
  Grid,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Button,
  Stack,
} from '@material-ui/core';
import SEO from 'components/SEO';

export default function Home() {
  return (
    <>
      <SEO />

      <Grid container justifyContent="center" sx={{ mt: 12 }}>
        <Grid item>
          <Typography variant="h5" textAlign="center">
            Sign In
          </Typography>
          <Paper sx={{ p: 4, width: 400, mt: 2 }}>
            <Stack spacing={2}>
              <TextField
                size="medium"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="body1">Email</Typography>
                    </InputAdornment>
                  ),
                }}
              />

              <Button variant="contained" fullWidth>
                Sign In
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
