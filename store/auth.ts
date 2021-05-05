import { gql, useQuery } from '@apollo/client';
import firebase from 'firebase/app';
import { useCallback, useEffect } from 'react';
import create from 'zustand';

/**
 * A logged in user object.
 */
type User = {
  id: number;
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

type IsLoggedInState = {
  isLoggedIn?: boolean;
  loggedIn: () => void;
  loggedOut: () => void;
};

const useIsLoggedInState = create<IsLoggedInState>((set) => ({
  isLoggedIn: null,
  loggedIn: () => set({ isLoggedIn: true }),
  loggedOut: () => set({ isLoggedIn: false }),
}));

export const useIsLoggedIn = () => useIsLoggedInState(useCallback((state) => state.isLoggedIn, []));

/**
 * Hook to listen on firebase auth and update the current logged in state.
 */
export function useAuthListener() {
  const loggedIn = useIsLoggedInState(useCallback((state) => state.loggedIn, []));
  const loggedOut = useIsLoggedInState(useCallback((state) => state.loggedOut, []));

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        loggedOut();
        return;
      }

      loggedIn();
    });
  }, [loggedIn, loggedOut]);
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

  // Refetch the user whenever the auth state changes.
  const isLoggedIn = useIsLoggedIn();
  const refetch = rest.refetch;
  useEffect(() => {
    refetch();
  }, [isLoggedIn, refetch]);

  return { user: data?.me as User, isLoggedIn, ...rest };
}
