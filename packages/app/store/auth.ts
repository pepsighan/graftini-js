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

/**
 * Login using GitHub account.
 */
export function loginWithGitHub(): Promise<firebase.auth.UserCredential> {
  const provider = new firebase.auth.GithubAuthProvider();
  return firebase.auth().signInWithPopup(provider);
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

  return { user: data?.me as User | null, isLoggedIn: !!data?.me, ...rest };
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
