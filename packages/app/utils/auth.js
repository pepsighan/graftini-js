import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useIsLoggedIn } from 'store/auth';

/**
 * HOC to protect the given page. Its not server rendereable right now.
 */
export function protectedPage(Component) {
  return function ProtectedPage() {
    const isLoggedIn = useIsLoggedIn();
    const { push } = useRouter();

    useEffect(() => {
      if (isLoggedIn === false) {
        // Go to home if not logged in.
        // TODO: Push the accessed page, so that it can be redirected to once logged in.
        push('/');
      }
    }, [isLoggedIn, push]);

    if (isLoggedIn === true) {
      return <Component />;
    }

    return null;
  };
}
