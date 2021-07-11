import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
  IconButton,
} from '@material-ui/core';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { sendSignLinkInToEmail } from 'store/auth';
import { z } from 'zod';
import { Cross1Icon } from '@modulz/radix-icons';

const schema = z.object({
  email: z.string().email(),
});

export default function EmailLinkForm({ onSend }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // The error is divided into error and text because this way the transition
  // is fluid when the snackbar closes.
  // TODO: Move to notistack once it is updated to MUI5.
  const [[error, errorText], setError] = useState([false, null]);
  const onCloseError = useCallback(() => {
    setError(([_, errorText]) => [false, errorText]);
  }, []);

  const onSubmit = useCallback(
    async ({ email }) => {
      try {
        await sendSignLinkInToEmail(email);
        onSend();
      } catch (err) {
        // Show the sending email link failed.
        setError([true, 'We could not send you an e-mail link. Please try in a while.']);
      }
    },
    [onSend]
  );

  return (
    <>
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

      <Snackbar
        open={error}
        se="error"
        onClose={onCloseError}
        message={errorText}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={onCloseError}>
            <Cross1Icon />
          </IconButton>
        }
      />
    </>
  );
}
