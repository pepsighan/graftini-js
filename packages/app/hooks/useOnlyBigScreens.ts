import { useMediaQuery, useTheme } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Redirects to home page if not on big screens.
 *
 * The only drawback here is that if user intentionally tries to resize the browser to a very small
 * size, then it will also redirect to home. So, this is to be used only in limited scenarios to
 * not allow users to visit some pages on mobile or tablets (for ex: login page).
 */
export default function useOnlyBigScreens() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { replace } = useRouter();

  useEffect(() => {
    if (isSmallScreen) {
      // If on small screens redirect to home page.
      replace('/');
    }
  }, [isSmallScreen, replace]);
}
