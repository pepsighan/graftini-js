import firebase from 'firebase/app';
import 'firebase/auth';

// It re-initialized firebase otherwise and errors out.
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyD-g9qamJTwYeDJRi80sP6X5qCCep07EMo',
    authDomain: 'nocodepress-dev.firebaseapp.com',
  });
}
