import { Box, Stack, Typography } from '@material-ui/core';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';

export default function Home() {
  return (
    <>
      <SEO />
      <Navigation />

      <Stack alignItems="center" sx={{ mt: 8 }}>
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
      </Stack>
    </>
  );
}
