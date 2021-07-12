import { AppBar, Box, Button, Toolbar } from '@material-ui/core';
import Link from 'next/link';
import { useAuthUser, useLogout } from 'store/auth';

export default function Navigation() {
  const { user } = useAuthUser();
  const onLogout = useLogout();

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
          <Box>
            <Link href="/dashboard/projects">
              <Button color="inherit" size="medium">
                Dashboard
              </Button>
            </Link>

            <Button color="inherit" onClick={onLogout} size="medium" sx={{ ml: 2 }}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
