import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  GlobalStyles,
  Grid,
  InputAdornment,
  Link as MLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@material-ui/core';
import logoLight from 'assets/logo-light.png';
import SEO from 'components/SEO';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import theme from 'utils/theme';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export default function Home() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const onSubmit = useCallback(() => {}, []);

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
            <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('email')}
                size="medium"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="body1">Email</Typography>
                    </InputAdornment>
                  ),
                }}
                error={!!errors?.email}
                helperText={errors?.email?.message}
              />

              <Button variant="contained" fullWidth type="submit">
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
