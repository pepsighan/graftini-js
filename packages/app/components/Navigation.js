import { AppBar, Button, IconButton, Stack, Toolbar, Box } from '@material-ui/core';
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

        {/* Do not show a login button in smaller screens. There is no use for this app on non-laptops
        or desktops. */}
        <Box sx={{ display: ['none', null, 'block'] }}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}
