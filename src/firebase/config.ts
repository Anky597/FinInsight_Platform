import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyykn1rqUv3dp9Gn4PFMnBtBprLKScC9E",
  authDomain: "ml-finance-b12f9.firebaseapp.com",
  projectId: "ml-finance-b12f9",
  storageBucket: "ml-finance-b12f9.firebasestorage.app",
  messagingSenderId: "707427822301",
  appId: "1:707427822301:web:60ecf4516348591b574934",
  measurementId: "G-XBMDN6PD08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;