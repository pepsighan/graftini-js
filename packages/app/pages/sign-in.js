import {
  Box,
  GlobalStyles,
  Grid,
  Link as MLink,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@material-ui/core';
import { LightningBoltIcon } from '@modulz/radix-icons';
import logoLight from 'assets/logo-light.png';
import Footer from 'components/Footer';
import SEO from 'components/SEO';
import EmailLinkForm from 'components/signIn/EmailLinkForm';
import useOnlyBigScreens from 'hooks/useOnlyBigScreens';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { unprotectedOnlyPage } from 'utils/auth';

export default unprotectedOnlyPage(function SignIn() {
  const [linkSent, setLinkSent] = useState(false);
  const [linkNotSent, setLinkNotSent] = useState(false);

  useOnlyBigScreens();

  const theme = useTheme();
  const onSend = useCallback((sent) => {
    if (sent) {
      setLinkSent(true);
    } else {
      setLinkNotSent(true);
    }
  }, []);

  return (
    <>
      <SEO title="Sign In" />
      <GlobalStyles
        styles={`
          body {
            background-color: ${theme.palette.grey[50]};
          }
        `}
      />

      <Stack justifyContent="space-between" sx={{ minHeight: '100vh' }}>
        <Grid container justifyContent="center" sx={{ mt: 12 }}>
          <Grid item sx={{ width: 400 }}>
            <Stack justifyContent="center" alignItems="center">
              <Link href="/" passHref>
                <MLink>
                  <Image src={logoLight} width={120} height={120} />
                </MLink>
              </Link>
            </Stack>
            <Paper sx={{ p: 4, mt: 16 }}>
              {!linkSent && <EmailLinkForm onSend={onSend} />}
              {linkSent && (
                <>
                  <Typography textAlign="center">We have sent a link to your e-mail.</Typography>
                  <Typography textAlign="center">Please click on that link to login.</Typography>

                  <Stack alignItems="center" sx={{ mt: 4, color: 'grey.500' }}>
                    <LightningBoltIcon width={24} height={24} />
                  </Stack>
                </>
              )}
            </Paper>

            {!linkNotSent && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ px: 1, display: 'block', mt: 1 }}
              >
                By signing in you agree to the terms of service and privacy policy of Graftini.
              </Typography>
            )}

            {!linkSent && !linkNotSent && (
              <Typography variant="body1" sx={{ px: 1, display: 'block', mt: 4 }}>
                We will send a link to your e-mail which you can use to sign in.
              </Typography>
            )}
          </Grid>
        </Grid>

        <Box sx={{ width: '100%', pb: 1, pt: 6 }}>
          <Footer />
        </Box>
      </Stack>
    </>
  );
});
