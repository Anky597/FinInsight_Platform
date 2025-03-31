import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "bring from .env file",
  authDomain: "*******",
  projectId: "*****",
  storageBucket: "*******",
  messagingSenderId: "******",
  appId: "*******",
  measurementId: "*****"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
