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
import { SignInErrors, useSendSignLinkInToEmail } from 'store/auth';
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

  const sendSignLinkInToEmail = useSendSignLinkInToEmail();

  const [error, setError] = useState(null);
  const onCloseError = useCallback(() => {
    setError(null);
  }, []);

  const onSubmit = useCallback(
    async ({ email }) => {
      const error = await sendSignLinkInToEmail(email);
      if (!error) {
        onSend();
        return;
      }

      setError(error);
    },
    [onSend, sendSignLinkInToEmail]
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

      {/* TODO: Move to notistack once it is updated to MUI5. */}
      <Snackbar
        open={error === SignInErrors.SendingLinkFailed}
        se="error"
        onClose={onCloseError}
        message={
          error === SignInErrors.SendingLinkFailed
            ? 'We could not send you an e-mail link. Please try in a while.'
            : null
        }
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
