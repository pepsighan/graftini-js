import {
  Button,
  CircularProgress,
  GlobalStyles,
  Grid,
  Link as MLink,
  Paper,
  Stack,
  Typography,
} from '@material-ui/core';
import logoLight from 'assets/logo-light.png';
import SEO from 'components/SEO';
import useOnlyBigScreens from 'hooks/useOnlyBigScreens';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { SignInErrors, verifyAndSignInWithEmailLink } from 'store/auth';
import { unprotectedOnlyPage } from 'utils/auth';
import theme from 'utils/theme';

export default unprotectedOnlyPage(function ConfirmSignIn() {
  const { push } = useRouter();
  const [error, setError] = useState(null);

  useOnlyBigScreens();

  useEffectOnce(() => {
    verifyAndSignInWithEmailLink().then((error) => {
      if (!error) {
        // Go to the projects page if login succeeds.
        push('/dashboard/projects');
        return;
      }
      setError(error);
    });
  });

  return (
    <>
      <SEO title="Confirm Sign In" />
      <GlobalStyles
        styles={`
          body {
            background-color: ${theme.palette.grey[50]};
          }
        `}
      />

      <Grid container justifyContent="center" sx={{ mt: 12 }}>
        <Grid item sx={{ width: 400 }}>
          <Stack justifyContent="center" alignItems="center">
            <Link href="/" passHref>
              <MLink>
                <Image src={logoLight} width={120} height={120} />
              </MLink>
            </Link>
          </Stack>
          <Paper sx={{ px: 4, py: error ? 4 : 8, mt: 16 }}>
            {!error && (
              <Stack alignItems="center">
                <CircularProgress />
              </Stack>
            )}

            {error && (
              <>
                <Typography textAlign="center">
                  {error === SignInErrors.InvalidSignInLink &&
                    'The sign in link is invalid. Please retry by sending a new link.'}
                  {error === SignInErrors.InvalidBrowser &&
                    'The sign in was attempted from a different browser than the one which sent the link.'}
                  {error === SignInErrors.ExpiredEmailLink &&
                    'The sign in link has expired. Please retry by sending a new link.'}
                </Typography>

                <Link href="/sign-in">
                  <Button variant="contained" fullWidth sx={{ mt: 3 }}>
                    Send a new link
                  </Button>
                </Link>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
});
