import { AppBar, Box, Button, Toolbar } from '@material-ui/core';
import Link from 'next/link';
import { logout, useAuthUser } from 'store/auth';
import { navBarHeight } from 'utils/constants';

export default function Navigation() {
  const { user } = useAuthUser();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'grey.400',
        height: navBarHeight,
      }}
    >
      <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
        <Link href="/" passHref>
          <Button component="a" color="inherit">
            Graftini
          </Button>
        </Link>

        {!user && (
          <Link href="/login">
            <Button color="inherit">Login</Button>
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
