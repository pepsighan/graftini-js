import { GlobalStyles, Grid, Link as MLink, Paper, Stack, Typography } from '@material-ui/core';
import logoLight from 'assets/logo-light.png';
import SEO from 'components/SEO';
import EmailLinkForm from 'components/signIn/EmailLinkForm';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import theme from 'utils/theme';
import { LightningBoltIcon } from '@modulz/radix-icons';

export default function Home() {
  const [linkSent, setLinkSent] = useState(false);

  const onSend = useCallback(() => {
    setLinkSent(true);
  }, []);

  return (
    <>
      <SEO />
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

          {!linkSent && (
            <Typography variant="body2" sx={{ px: 1, display: 'block', mt: 1 }}>
              We will send a link to your e-mail which you can use to sign in.
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
}
