import {
  Alert,
  Box,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@material-ui/core';
import AsyncButton from 'components/AsyncButton';
import Footer from 'components/Footer';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';
import { materialRegister } from 'hooks/useMaterialFormRegister';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthUser, useUpdateProfile } from 'store/auth';
import { protectedPage } from 'utils/auth';
import { navBarHeight } from 'utils/constants';

export default protectedPage(function Profile() {
  const { user } = useAuthUser();

  return (
    <>
      <SEO title="Profile" />
      <Navigation />

      <Stack
        justifyContent="space-between"
        sx={{ minHeight: `calc(100vh - ${navBarHeight}px)`, px: 2, overflow: 'hidden' }}
      >
        <Container sx={{ mt: 4 }} maxWidth="xs">
          <Typography variant="h5">Your Profile</Typography>
          <ProfileForm key={!!user} user={user} />
        </Container>

        <Box sx={{ width: '100%', pb: 1, pt: 6 }}>
          <Footer />
        </Box>
      </Stack>
    </>
  );
});

function ProfileForm({ user }) {
  const [status, setStatus] = useState(null);
  const [updateProfile, { loading }] = useUpdateProfile();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    },
  });

  const onUpdate = useCallback(
    async (state) => {
      try {
        setStatus(null);
        await updateProfile({
          variables: {
            input: {
              firstName: state.firstName,
              lastName: state.lastName,
            },
          },
        });
        setStatus('success');
      } catch (err) {
        setStatus('error');
        throw err;
      }
    },
    [updateProfile]
  );

  return (
    <Stack component="form" spacing={2} sx={{ mt: 3 }} onSubmit={handleSubmit(onUpdate)}>
      <TextField
        {...materialRegister(register, 'firstName')}
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ width: 100 }}>
              <Typography>First Name</Typography>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        {...materialRegister(register, 'lastName')}
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ width: 100 }}>
              <Typography>Last Name</Typography>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        value={user?.email ?? ''}
        size="medium"
        disabled
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ width: 100 }}>
              <Typography>Email</Typography>
            </InputAdornment>
          ),
        }}
        helperText="You cannot change your email."
      />

      <AsyncButton type="submit" variant="contained" size="medium" isLoading={loading}>
        Save
      </AsyncButton>

      {status && (
        <Alert severity={status}>
          {status === 'success'
            ? 'Your profile changes has been saved.'
            : 'There was some issue while saving. Try again later.'}
        </Alert>
      )}
    </Stack>
  );
}
