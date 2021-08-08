import { gql, useMutation, useQuery } from '@apollo/client';
import firebase from 'firebase/app';
import { useCallback, useEffect } from 'react';

/**
 * A logged in user object.
 */
type User = {
  string: number;
  firstName?: string;
  lastName?: string;
  email: string;
  isAdmin: boolean;
};

const signInLinkToEmailKey = 'sign-in-link-to-email';

export enum SignInErrors {
  EarlyAccessNotAllowed = 'early_access_not_allowed',
  SendingLinkFailed = 'sending_link_failed',
  InvalidSignInLink = 'invalid_sign_in_link',
  InvalidBrowser = 'invalid_browser',
  ExpiredEmailLink = 'expired_email_link',
}

/**
 * Sends a sign link to the given email. The user is redirected the confirm
 * sign in link once it clicks on the sent link.
 */
export function useSendSignLinkInToEmail() {
  const isEarlyAccessAllowed = useIsEarlyAccessAllowed();

  return useCallback(
    async (email: string): Promise<SignInErrors | null> => {
      const isAllowed = await isEarlyAccessAllowed(email);
      if (!isAllowed) {
        return SignInErrors.EarlyAccessNotAllowed;
      }

      try {
        await firebase.auth().sendSignInLinkToEmail(email, {
          url: `${window.location.origin}/confirm-sign-in`,
          handleCodeInApp: true,
        });
        // Save the email for confirming later.
        window.localStorage.setItem(signInLinkToEmailKey, email);
      } catch (error) {
        return SignInErrors.SendingLinkFailed;
      }

      return null;
    },
    [isEarlyAccessAllowed]
  );
}

/**
 * Attempts to sign in the user with the email link in the browser address bar.
 */
export async function verifyAndSignInWithEmailLink(): Promise<SignInErrors | null> {
  const auth = firebase.auth();

  if (!auth.isSignInWithEmailLink(window.location.href)) {
    return SignInErrors.InvalidSignInLink;
  }

  // The link that was used to send the link with.
  const email = window.localStorage.getItem(signInLinkToEmailKey);
  if (!email) {
    // The email does not exist on this browser. So, the link may have
    // been sent from a different one.
    return SignInErrors.InvalidBrowser;
  }

  try {
    await auth.signInWithEmailLink(email, window.location.href);
    window.localStorage.removeItem(signInLinkToEmailKey);
  } catch (error) {
    // TODO: Log the error that was thrown. We need to better understand
    // under what scenarios this error is thrown.
    return SignInErrors.ExpiredEmailLink;
  }

  return null;
}

/**
 * Logout the current user.
 */
export async function logout() {
  await firebase.auth().signOut();
}

/**
 * Hook to get the currently logged in user and the logged in state.
 */
export function useAuthUser() {
  const { data, ...rest } = useQuery(
    gql`
      query GetMe {
        me {
          id
          firstName
          lastName
          email
          isAdmin
        }
      }
    `
  );

  return {
    user: data?.me as User | null,
    isLoggedIn: !rest.loading ? !!data?.me : undefined,
    ...rest,
  };
}

/**
 * Gets the current firebase user if logged in or else returns null.
 */
export async function getCurrentFirebaseUser(): Promise<firebase.User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}

/**
 * Listen to the current firebase user stream.
 */
export function useListenToCurrentFirebaseUserStream(
  onChange: (user: firebase.User | null) => void
) {
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(onChange);
  }, [onChange]);
}

/**
 * Refetch the user once the user auth state changes.
 */
export function useRefetchAuthUserOnAuthStateChange() {
  const { refetch } = useAuthUser();

  useListenToCurrentFirebaseUserStream(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
}

/**
 * Hook to check if the email is allowed for early access.
 */
export function useIsEarlyAccessAllowed() {
  const [isEarlyAccessAllowed] = useMutation(gql`
    mutation IsEarlyAccessAllowed($email: String!) {
      isEarlyAccessAllowed(email: $email)
    }
  `);

  return useCallback(
    async (email: string): Promise<boolean> => {
      const res = await isEarlyAccessAllowed({
        variables: {
          email,
        },
      });

      return res.data?.isEarlyAccessAllowed ?? false;
    },
    [isEarlyAccessAllowed]
  );
}
