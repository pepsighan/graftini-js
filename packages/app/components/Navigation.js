import { AppBar, Box, Button, IconButton, Stack, Toolbar, Tooltip } from '@material-ui/core';
import { CrumpledPaperIcon, EnterIcon } from '@modulz/radix-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthUser } from 'store/auth';
import FeedbackFish from './FeedbackFish';
import GraftiniLogo from './GraftiniLogo';
import ProfileButton from './ProfileButton';

export default function Navigation() {
  const { route } = useRouter();
  const { user } = useAuthUser();

  const isWithinDashboard = route.startsWith('/dashboard');
  const isWithinProfile = route.startsWith('/profile');
  const isBorderless = !isWithinDashboard && !isWithinProfile;

  return (
    <AppBar
      sx={{
        border: isBorderless ? 0 : undefined,
      }}
    >
      <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
        <Link href={isWithinDashboard ? '/dashboard/projects' : '/'} passHref>
          <IconButton component="a" color="inherit">
            <GraftiniLogo />
          </IconButton>
        </Link>

        {/* Do not show a login button in smaller screens. There is no use for this app on non-laptops
        or desktops. */}
        <Stack spacing={2} direction="row" alignItems="center">
          {isBorderless && (
            <>
              <Link href="/pricing" passHref>
                <Button component="a" color="inherit" size="medium">
                  Pricing
                </Button>
              </Link>

              <Button
                component="a"
                href="https://blog.graftini.com"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                size="medium"
              >
                Blog
              </Button>
            </>
          )}

          <Stack
            direction="row"
            spacing={2}
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
            }}
          >
            {!user && (
              <>
                <Link href="/sign-in" passHref>
                  <Button
                    component="a"
                    variant="contained"
                    size="medium"
                    sx={{
                      display: {
                        xs: 'none',
                        md: 'inline-flex',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}

            {user && (
              <>
                {!isWithinDashboard && (
                  <Link href="/dashboard/projects">
                    <Tooltip title="Open Dashboard">
                      <IconButton color="inherit">
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 20,
                            height: 20,
                          }}
                        >
                          <EnterIcon />
                        </Box>
                      </IconButton>
                    </Tooltip>
                  </Link>
                )}

                {isWithinDashboard && (
                  <FeedbackFish>
                    <Button color="inherit">
                      <CrumpledPaperIcon />
                      <Box sx={{ ml: 0.5 }}>Give us Feedback</Box>
                    </Button>
                  </FeedbackFish>
                )}

                <ProfileButton />
              </>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
