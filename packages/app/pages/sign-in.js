import { GlobalStyles, Grid, Link as MLink, Paper, Stack, Typography } from '@material-ui/core';
import logoLight from 'assets/logo-light.png';
import SEO from 'components/SEO';
import EmailLinkForm from 'components/signIn/EmailLinkForm';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import theme from 'utils/theme';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export default function Home() {
  const onSend = useCallback(() => {}, []);

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
            <EmailLinkForm onSend={onSend} />
          </Paper>

          <Typography variant="body2" sx={{ px: 1, display: 'block', mt: 1 }}>
            We will send a link to your e-mail which you can use to sign in.
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
