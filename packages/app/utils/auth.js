import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useAuthUser, useListenToCurrentFirebaseUserStream } from 'store/auth';

/**
 * HOC to protect the given page. Its not server rendereable right now.
 */
export function protectedPage(Component) {
  return function ProtectedPage() {
    const { isLoggedIn } = useAuthUser();
    const { push } = useRouter();

    // Firebase is the source that identifies the authenticated user.
    useListenToCurrentFirebaseUserStream(
      useCallback(
        (user) => {
          if (!user) {
            // Go to home if not logged in.
            // TODO: Push the accessed page, so that it can be redirected to once logged in.
            push('/');
          }
        },
        [push]
      )
    );

    // The graphql query is the one which loads the actual user from the backend.
    if (isLoggedIn === true) {
      return <Component />;
    }

    return null;
  };
}

/**
 * These pages are only visible when not logged in. For example: Sign in page.
 */
export function unprotectedOnlyPage(Component) {
  return function UnprotectedPage() {
    const { isLoggedIn } = useAuthUser();
    const { push } = useRouter();

    // Firebase is the source that identifies the authenticated user.
    useListenToCurrentFirebaseUserStream(
      useCallback(
        (user) => {
          if (user) {
            // Go to home if logged in.
            push('/');
          }
        },
        [push]
      )
    );

    // The graphql query is the one which loads the actual user from the backend.
    if (isLoggedIn === false) {
      return <Component />;
    }

    return null;
  };
}
