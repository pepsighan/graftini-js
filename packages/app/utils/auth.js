import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAsync } from 'react-use';
import { getCurrentFirebaseUser, useAuthUser } from 'store/auth';

/**
 * HOC to protect the given page. Its not server rendereable right now.
 */
export function protectedPage(Component) {
  return function ProtectedPage() {
    // Do not show the page until the auth user has loaded.
    const { loading } = useAsync(getCurrentFirebaseUser);

    const { isLoggedIn } = useAuthUser();
    const { push } = useRouter();

    useEffect(() => {
      if (!loading && isLoggedIn === false) {
        // Go to home if not logged in.
        // TODO: Push the accessed page, so that it can be redirected to once logged in.
        push('/');
      }
    }, [isLoggedIn, loading, push]);

    if (isLoggedIn === true) {
      return <Component />;
    }

    return null;
  };
}
