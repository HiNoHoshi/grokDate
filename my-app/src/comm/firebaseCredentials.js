// Firebase imports
import firebase  from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: "AIzaSyD-cNAtjiQgnStGM3HEQv4Rlgq3kMhWXi4",
  authDomain: "grokdate-fdf76.firebaseapp.com",
  databaseURL: "https://grokdate-fdf76.firebaseio.com",
  projectId: "grokdate-fdf76",
  storageBucket: "grokdate-fdf76.appspot.com",
  messagingSenderId: "452875068925",
  appId: "1:452875068925:web:8188d275aa3f8c51b26594"
});
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;
