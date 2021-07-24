import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, TextField } from '@material-ui/core';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export default function EarlyAccessRequest() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(() => {}, []);

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
      <Button type="submit" variant="contained" size="medium">
        Request Early Access
      </Button>
    </Stack>
  );
}
