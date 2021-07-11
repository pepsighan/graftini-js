import { gql, useQuery } from '@apollo/client';
import firebase from 'firebase/app';

/**
 * A logged in user object.
 */
type User = {
  string: number;
  firstName?: string;
  lastName?: string;
  email: string;
};

const signInLinkToEmailKey = 'sign-in-link-to-email';

/**
 * Sends a sign link to the given email. The user is redirected the confirm
 * sign in link once it clicks on the sent link.
 */
export async function sendSignLinkInToEmail(email: string): Promise<void> {
  await firebase.auth().sendSignInLinkToEmail(email, {
    url: `${window.location.origin}/confirm-sign-in`,
    handleCodeInApp: true,
  });
  // Save the email for confirming later.
  window.localStorage.setItem(signInLinkToEmailKey, email);
}

export enum SignInErrors {
  InvalidSignInLink,
  InvalidBrowser,
  ExpiredEmailLink,
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
export function logout(): Promise<void> {
  return firebase.auth().signOut();
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
