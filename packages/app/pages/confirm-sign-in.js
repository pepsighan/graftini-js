import {
  CircularProgress,
  GlobalStyles,
  Grid,
  Link as MLink,
  Paper,
  Stack,
} from '@material-ui/core';
import logoLight from 'assets/logo-light.png';
import SEO from 'components/SEO';
import Image from 'next/image';
import Link from 'next/link';
import theme from 'utils/theme';

export default function ConfirmSignIn() {
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
          <Paper sx={{ px: 4, py: 8, mt: 16 }}>
            <Stack alignItems="center">
              <CircularProgress />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
