export async function initializeFirebase() {
  if (typeof window === 'undefined') {
    return;
  }

  const { default: firebase } = await import('firebase/app');
  await import('firebase/auth');

  firebase.initializeApp({
    apiKey: 'AIzaSyD-g9qamJTwYeDJRi80sP6X5qCCep07EMo',
    authDomain: 'nocodepress-dev.firebaseapp.com',
  });
}
