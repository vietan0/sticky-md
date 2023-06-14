import { initializeApp } from 'firebase/app';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signInWithPopup,
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDs20kHJAATZRNHvalLK3zzO5qhR7Hzjeg',
  authDomain: 'sticky-md.firebaseapp.com',
  projectId: 'sticky-md',
  storageBucket: 'sticky-md.appspot.com',
  messagingSenderId: '603996649834',
  appId: '1:603996649834:web:018c8d7e6a8582d1174d13',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

async function emailSignUp(email: string, password: string) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    console.log('signed up with email!');
    console.log(userCred);
    const { user } = userCred; // The signed-in user info
  } catch (error) {
    console.log('sign up with email failed!');
    console.log(error);
  }
}

async function emailSignIn(email: string, password: string) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log('signed in with email!');
    console.log(userCred);
    const { user } = userCred; // The signed-in user info
  } catch (error) {
    console.log('sign in with email failed!');
    console.log(error);
  }
}

async function oAuthSignIn(provider: GoogleAuthProvider | GithubAuthProvider) {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('signed in with oauth!');
    console.log(result);
    const { user } = result; // The signed-in user info
  } catch (error) {
    console.log('sign in with oauth failed!');
    console.log(error);
  }
}

export { auth, emailSignUp, emailSignIn, oAuthSignIn, githubProvider, googleProvider };
