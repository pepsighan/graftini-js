import { AppBar, Button, Stack, Toolbar } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthUser } from 'store/auth';
import ProfileButton from './ProfileButton';

export default function Navigation() {
  const { route } = useRouter();
  const { user } = useAuthUser();

  const isWithinDashboard = route.startsWith('/dashboard');

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
            {!isWithinDashboard && (
              <Link href="/dashboard/projects">
                <Button color="inherit" size="medium">
                  Dashboard
                </Button>
              </Link>
            )}

            <ProfileButton />
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
