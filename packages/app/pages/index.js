import { Box, Button, Stack, Typography } from '@material-ui/core';
import EarlyAccessRequest from 'components/EarlyAccessRequest';
import Footer from 'components/Footer';
import Link from 'components/Link';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';
import Image from 'next/image';
import NLink from 'next/link';
import { useState } from 'react';
import { useAuthUser } from 'store/auth';
import { navBarHeight } from 'utils/constants';
import previewImg from 'assets/preview.png';

export default function Home() {
  const [isAccessAllowed, setIsAccessAllowed] = useState(null);
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
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight="normal"
            color="textSecondary"
            sx={{ mt: 1 }}
          >
            Deploy your web apps without writing any code in less than 10 minutes.
          </Typography>

          <Box
            sx={{
              width: {
                xs: '100%',
                sm: 650,
                md: 950,
              },
              mt: 4,
            }}
          >
            <Image src={previewImg} placeholder="blur" />
          </Box>

          {!isLoggedIn && (
            <>
              {isAccessAllowed === null && <EarlyAccessRequest onRequested={setIsAccessAllowed} />}

              {isAccessAllowed === false && (
                <>
                  <Typography component="div" variant="h3" sx={{ mt: 2 }}>
                    🎉
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    We have added you to the early access queue.
                  </Typography>
                  <Typography>
                    You will receive a confirmation email in a while, if you have not already.
                  </Typography>
                </>
              )}

              {isAccessAllowed !== true && (
                <Typography color="textSecondary" sx={{ mt: 2 }}>
                  If you are already received an invitation to access Graftini,{' '}
                  <Link href="/sign-in" sx={{ textDecoration: 'underline' }}>
                    sign in
                  </Link>{' '}
                  to get access. .
                </Typography>
              )}

              {isAccessAllowed === true && (
                <>
                  <Typography sx={{ mt: 2 }}>
                    You already have access to Graftini, sign in with the same email.
                  </Typography>

                  <NLink href="/sign-in" passHref>
                    <Button component="a" variant="contained" size="medium" sx={{ mt: 1 }}>
                      Sign In
                    </Button>
                  </NLink>
                </>
              )}
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
