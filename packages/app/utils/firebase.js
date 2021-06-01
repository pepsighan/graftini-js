import firebase from 'firebase/app';
import 'firebase/auth';
import config from './config';

// It re-initialized firebase otherwise and errors out.
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTH_DOMAIN,
  });
}
