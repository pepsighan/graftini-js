import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, TextField } from '@material-ui/core';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useIsEarlyAccessAllowed } from 'store/auth';
import { z } from 'zod';
import AsyncButton from './AsyncButton';

const schema = z.object({
  email: z.string().email(),
});

export default function EarlyAccessRequest({ onRequested }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const isEarlyAccessAllowed = useIsEarlyAccessAllowed();

  const onSubmit = useCallback(
    async (state) => {
      const isAllowed = await isEarlyAccessAllowed(state.email);
      onRequested(isAllowed);
    },
    [isEarlyAccessAllowed, onRequested]
  );

  return (
    <Stack
      component="form"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      alignItems="flex-start"
      spacing={1}
      sx={{
        mt: 4,
        width: {
          xs: '100%',
          sm: 450,
        },
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        {...register('email')}
        size="medium"
        placeholder="Enter your email"
        fullWidth
        sx={{ flex: 1 }}
        error={!!errors?.email}
        helperText={errors?.email?.message}
      />
      <AsyncButton
        type="submit"
        variant="contained"
        size="medium"
        fullWidth
        isLoading={isSubmitting}
      >
        Request Early Access
      </AsyncButton>
    </Stack>
  );
}
