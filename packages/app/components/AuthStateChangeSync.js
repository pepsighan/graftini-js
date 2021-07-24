import { useRefetchAuthUserOnAuthStateChange } from 'store/auth';

/**
 * Refetch the user from backend once the user auth state changes.
 */
export default function AuthStateChangeSync() {
  useRefetchAuthUserOnAuthStateChange();
  return <></>;
}
