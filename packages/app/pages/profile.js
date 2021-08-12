import {
  Container,
  TextField,
  Typography,
  Stack,
  InputAdornment,
  Button,
  Box,
} from '@material-ui/core';
import Footer from 'components/Footer';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';
import { useAuthUser } from 'store/auth';
import { protectedPage } from 'utils/auth';
import { navBarHeight } from 'utils/constants';

export default protectedPage(function Profile() {
  const { user } = useAuthUser();

  return (
    <>
      <SEO title="Profile" />
      <Navigation />

      <Stack
        justifyContent="space-between"
        sx={{ minHeight: `calc(100vh - ${navBarHeight}px)`, px: 2, overflow: 'hidden' }}
      >
        <Container sx={{ mt: 4 }} maxWidth="xs">
          <Typography variant="h5">Your Profile</Typography>
          <Stack spacing={2} sx={{ mt: 3 }}>
            <TextField
              value={user.firstName ?? ''}
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ width: 100 }}>
                    <Typography>First Name</Typography>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              value={user.lastName ?? ''}
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ width: 100 }}>
                    <Typography>Last Name</Typography>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              value={user.email}
              size="medium"
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ width: 100 }}>
                    <Typography>Email</Typography>
                  </InputAdornment>
                ),
              }}
              helperText="You cannot change your email."
            />

            <Button variant="contained" size="medium">
              Save
            </Button>
          </Stack>
        </Container>

        <Box sx={{ width: '100%', pb: 1, pt: 6 }}>
          <Footer />
        </Box>
      </Stack>
    </>
  );
});
