import { zodResolver } from '@hookform/resolvers/zod';
import {
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@material-ui/core';
import { Cross1Icon } from '@modulz/radix-icons';
import AsyncButton from 'components/AsyncButton';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SignInErrors, useSendSignLinkInToEmail } from 'store/auth';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export default function EmailLinkForm({ onSend }) {
  const {
    register,
    formState: { errors, isSubmitting },
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
        onSend(true);
        return;
      }

      onSend(false);
      setError(error);
    },
    [onSend, sendSignLinkInToEmail]
  );

  return (
    <>
      {error !== SignInErrors.EarlyAccessNotAllowed && (
        <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
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
            sx={{ mb: 2 }}
          />

          <AsyncButton
            variant="contained"
            fullWidth
            type="submit"
            size="medium"
            isLoading={isSubmitting}
          >
            Sign In
          </AsyncButton>
        </Stack>
      )}

      {/* TODO: Add the user to early access list if they were not allowed. */}
      {error === SignInErrors.EarlyAccessNotAllowed && (
        <>
          <Typography textAlign="center">
            Sorry, you are currently not allowed for early access.
          </Typography>

          <Typography textAlign="center">
            Since you are interested, we have added your email to the queue. We will notify you once
            you are invited.
          </Typography>
        </>
      )}

      {/* TODO: Move to notistack once it is updated to MUI5. */}
      <Snackbar
        open={error === SignInErrors.SendingLinkFailed}
        onClose={onCloseError}
        message={
          error === SignInErrors.SendingLinkFailed
            ? 'We could not send you an email link. Please try in a while.'
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
