import { Box, Button, Stack, Typography } from '@material-ui/core';
import previewImg from 'assets/preview.png';
import Footer from 'components/Footer';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';
import Image from 'next/image';
import Link from 'next/link';
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
        sx={{ height: `calc(100vh - ${navBarHeight}px)`, px: 2 }}
      >
        <Stack alignItems="center" sx={{ pt: 8 }}>
          <Typography variant="h3" textAlign="center">
            Graftini
          </Typography>
          <Typography variant="h6" textAlign="center" fontWeight="normal" color="textSecondary">
            Deploy your web apps without writing any code in less than 10 minutes.
          </Typography>

          <Box
            sx={{
              width: {
                xs: '100%',
                sm: 650,
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
                We are currently only open for Early Access. If you are interested, you may request
                for early access by clicking the button below.
              </Typography>
              <Link href="/early-access-registration" passHref>
                <Button component="a" variant="contained" size="medium">
                  Request for Early Access
                </Button>
              </Link>
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
