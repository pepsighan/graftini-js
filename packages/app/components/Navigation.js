import { AppBar, Box, Button, Toolbar } from '@material-ui/core';
import Link from 'next/link';
import { logout, useAuthUser } from 'store/auth';

export default function Navigation() {
  const { user } = useAuthUser();

  return (
    <AppBar>
      <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
        <Link href="/" passHref>
          <Button component="a" color="inherit">
            Graftini
          </Button>
        </Link>

        {!user && (
          <Link href="/sign-in">
            <Button variant="contained">Sign In</Button>
          </Link>
        )}

        {user && (
          <Box>
            <Link href="/dashboard/projects">
              <Button color="inherit">Dashboard</Button>
            </Link>

            <Button color="inherit" onClick={logout} sx={{ ml: 2 }}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
