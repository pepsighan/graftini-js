import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getCurrentFirebaseUser, useAuthUser } from 'store/auth';

/**
 * HOC to protect the given page. Its not server rendereable right now.
 */
export function protectedPage(Component) {
  return function ProtectedPage() {
    const { isLoggedIn } = useAuthUser();
    const { push } = useRouter();

    useEffect(() => {
      // Firebase is the source that identifies the authenticated user.
      getCurrentFirebaseUser().then((user) => {
        if (!user) {
          // Go to home if not logged in.
          // TODO: Push the accessed page, so that it can be redirected to once logged in.
          push('/');
        }
      });
    }, [push]);

    // The graphql query is the one which loads the actual user from the backend.
    if (isLoggedIn === true) {
      return <Component />;
    }

    return null;
  };
}
