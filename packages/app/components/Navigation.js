import { AppBar, Box, Button, Toolbar } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { loginWithGitHub, logout, useAuthUser } from 'store/auth';
import { navBarHeight } from 'utils/constants';

export default function Navigation() {
  const { push } = useRouter();

  const onLogin = useCallback(async () => {
    await loginWithGitHub();
    push('/dashboard/projects');
  }, [push]);

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
          <Button color="inherit" onClick={onLogin}>
            Login
          </Button>
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
