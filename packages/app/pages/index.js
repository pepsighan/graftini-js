import { Box, Stack, Typography } from '@material-ui/core';
import previewImg from 'assets/preview.png';
import Footer from 'components/Footer';
import Navigation from 'components/Navigation';
import ProductHunt from 'components/ProductHunt';
import SEO from 'components/SEO';
import Image from 'next/image';
import { useAuthUser } from 'store/auth';
import { navBarHeight } from 'utils/constants';

export default function Home() {
  const { isLoggedIn } = useAuthUser();

  return (
    <>
      <SEO />
      <Navigation />

      <Stack
        justifyContent="space-between"
        sx={{ minHeight: `calc(100vh - ${navBarHeight}px)`, px: 2, overflow: 'hidden' }}
      >
        <Stack alignItems="center" sx={{ pt: 8 }}>
          <Typography variant="h3" textAlign="center">
            Graftini
          </Typography>
          <Typography variant="h6" textAlign="center" fontWeight="normal" color="textSecondary">
            Design &amp; deploy frontends for your headless WordPress without writing any code.
          </Typography>

          <Box
            sx={{
              width: {
                xs: '200%',
                sm: '120%',
                md: 950,
              },
              mt: 2,
            }}
          >
            <Image src={previewImg} placeholder="blur" />
          </Box>

          {!isLoggedIn && (
            <>
              <Typography
                textAlign="center"
                sx={{
                  mb: 2,
                  width: {
                    md: 600,
                  },
                }}
              >
                We are currently only open for early access.
              </Typography>

              <ProductHunt />
            </>
          )}
        </Stack>

        <Box sx={{ width: '100%', pb: 1, pt: 6 }}>
          <Footer />
        </Box>
      </Stack>
    </>
  );
}
