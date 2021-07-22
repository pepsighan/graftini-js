import { AppBar, Button, IconButton, Stack, Toolbar } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthUser } from 'store/auth';
import GraftiniLogo from './GraftiniLogo';
import ProfileButton from './ProfileButton';

export default function Navigation() {
  const { route } = useRouter();
  const { user } = useAuthUser();

  const isWithinDashboard = route.startsWith('/dashboard');

  return (
    <AppBar>
      <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
        <Link href={isWithinDashboard ? '/dashboard/projects' : '/'} passHref>
          <IconButton component="a" color="inherit">
            <GraftiniLogo />
          </IconButton>
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
