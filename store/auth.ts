import firebase from 'firebase/app';
import produce from 'immer';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import create from 'zustand';
import { useImmerSetter, WithImmerSetter } from './zustand';

/**
 * A logged in user object.
 */
type User = {
  fullName: string;
  email: string;
  photoURL?: string;
};

type AuthStore = {
  user?: User;
  isLoggedIn?: boolean;
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
 * Hook to get the currently logged in user.
 */
export const useAuth = create<WithImmerSetter<AuthStore>>((set) => ({
  user: null,
  isLoggedIn: null,
  set: (fn) => set(produce(fn)),
}));

/**
 * Get the user object within the auth state.
 */
export const useUser = () => useAuth(useCallback((state) => state.user, []));

/**
 * Hook to get whether the user is logged in. It may be null if the logged in status
 * is not yet know. This may happen during first load.
 */
export const useIsLoggedIn = () => useAuth(useCallback((state) => state.isLoggedIn, []));

/**
 * Hook to listen on firebase auth and update the halka state referred to by `useAuth`.
 */
export function useAuthListener() {
  const set = useImmerSetter(useAuth);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        set((state) => {
          state.user = null;
          state.isLoggedIn = false;
        });
        return;
      }

      set((state) => {
        state.user = {
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        state.isLoggedIn = true;
      });
    });
  }, [set]);
}

/**
 * Hook that redirects the app back after login. This function checks for `redirectUrl` query
 * param to redirect back to if present. Otherwise redirects to `/dashboard`.
 */
export function useRedirectBackAfterLogin() {
  const router = useRouter();

  return useCallback(() => {
    // Using router's query params does not give the latest value.
    const search = new URLSearchParams(window.location.search);
    const redirectUrl = search.get('redirectUrl');

    if (!redirectUrl) {
      // Redirect to /dashboard.
      router.push('/dashboard');
      return;
    }

    // The redirectUrl may be encoded to make it safe for usage as a query param.
    const decodedUrl = decodeURIComponent(redirectUrl as string);
    router.push(decodedUrl);
  }, [router]);
}
