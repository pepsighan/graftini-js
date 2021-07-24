import { Box, Stack, Typography } from '@material-ui/core';
import Footer from 'components/Footer';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';
import { navBarHeight } from 'utils/constants';

export default function Pricing() {
  return (
    <>
      <SEO />
      <Navigation />

      <Stack justifyContent="space-between" sx={{ height: `calc(100vh - ${navBarHeight}px)` }}>
        <Stack alignItems="center" sx={{ pt: 8 }}>
          <Typography variant="h3" textAlign="center">
            Pricing
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
        </Stack>

        <Box sx={{ width: '100%', pb: 1, pt: 6 }}>
          <Footer />
        </Box>
      </Stack>
    </>
  );
}
