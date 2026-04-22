
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBjPb22AXRwbd32xBYJ0kl6NHUTojGfnCs",
  authDomain: "resumeai-50521.firebaseapp.com",
  projectId: "resumeai-50521",
  storageBucket: "resumeai-50521.firebasestorage.app",
  messagingSenderId: "646012300015",
  appId: "1:646012300015:web:026ff0bfff8e006e4b891a",
  measurementId: "G-FJ22LEV9SV"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
