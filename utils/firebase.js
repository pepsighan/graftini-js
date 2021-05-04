import firebase from 'firebase/app';
import 'firebase/auth';

export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return;
  }

  firebase.initializeApp({
    apiKey: 'AIzaSyD-g9qamJTwYeDJRi80sP6X5qCCep07EMo',
    authDomain: 'nocodepress-dev.firebaseapp.com',
  });
}
