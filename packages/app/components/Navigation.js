import { AppBar, Button, Stack, Toolbar } from '@material-ui/core';
import Link from 'next/link';
import { useAuthUser } from 'store/auth';
import ProfileButton from './ProfileButton';

export default function Navigation() {
  const { user } = useAuthUser();

  return (
    <AppBar>
      <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
        <Link href="/" passHref>
          <Button component="a" color="inherit" size="medium">
            Graftini
          </Button>
        </Link>

        {!user && (
          <Link href="/sign-in">
            <Button variant="contained" size="medium">
              Sign In
            </Button>
          </Link>
        )}

        {user && (
          <Stack spacing={2} direction="row" alignItems="center">
            <Link href="/dashboard/projects">
              <Button color="inherit" size="medium">
                Dashboard
              </Button>
            </Link>

            <ProfileButton />
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
