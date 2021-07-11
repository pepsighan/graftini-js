import { zodResolver } from '@hookform/resolvers/zod';
import { Button, InputAdornment, Stack, TextField, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { sendSignLinkInToEmail } from 'store/auth';
import { z } from 'zod';

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

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = useCallback(
    async ({ email }) => {
      try {
        await sendSignLinkInToEmail(email);
        onSend();
      } catch (err) {
        // Show the sending email link failed.
        enqueueSnackbar('We could not send you an e-mail link. Please try in a while.', {
          variant: 'error',
        });
      }
    },
    [enqueueSnackbar, onSend]
  );

  return (
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
  );
}
