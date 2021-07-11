import {
  Button,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Link as MLink,
  TextField,
  Typography,
  GlobalStyles,
} from '@material-ui/core';
import logoLight from 'assets/logo-light.png';
import SEO from 'components/SEO';
import Image from 'next/image';
import theme from 'utils/theme';
import Link from 'next/link';

export default function Home() {
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
            <Stack spacing={2}>
              <TextField
                size="medium"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="body1">Email</Typography>
                    </InputAdornment>
                  ),
                }}
              />

              <Button variant="contained" fullWidth>
                Sign In
              </Button>
            </Stack>
          </Paper>

          <Typography variant="body2" sx={{ px: 1, display: 'block', mt: 1 }}>
            We will send a link to your e-mail which you can use to sign in.
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
