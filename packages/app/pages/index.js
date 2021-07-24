import { Box, Button, Stack, TextField, Typography } from '@material-ui/core';
import Footer from 'components/Footer';
import Link from 'components/Link';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';
import { navBarHeight } from 'utils/constants';

export default function Home() {
  return (
    <>
      <SEO />
      <Navigation />

      <Stack justifyContent="space-between" sx={{ height: `calc(100vh - ${navBarHeight}px)` }}>
        <Stack alignItems="center" sx={{ pt: 8 }}>
          <Typography variant="h3" textAlign="center">
            Graftini
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight="normal"
            color="textSecondary"
            sx={{ mt: 1 }}
          >
            Deploy your web apps without writing any code in less than 10 minutes.
          </Typography>

          <Box sx={{ width: 700, height: 400, bgcolor: 'grey.200', mt: 4, borderRadius: 1 }}>
            {/* Here would be a video of how we deploy the app in 10 minutes. */}
          </Box>

          <Stack direction="row" spacing={1} sx={{ mt: 4 }}>
            <TextField size="medium" placeholder="Enter your email" />
            <Button variant="contained" size="medium">
              Request Early Access
            </Button>
          </Stack>

          <Typography color="textSecondary" sx={{ mt: 2 }}>
            If you are already received an invitation to access Graftini, just{' '}
            <Link href="/sign-in" sx={{ textDecoration: 'underline' }}>
              sign in
            </Link>
            .
          </Typography>
        </Stack>

        <Box sx={{ width: '100%', pb: 1, pt: 6 }}>
          <Footer />
        </Box>
      </Stack>
    </>
  );
}
