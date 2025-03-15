import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQyzO6tVm4CMol5Bt-Rr9brXjYpA7w-DY",
  authDomain: "roadsafe-bb4be.firebaseapp.com",
  projectId: "roadsafe-bb4be",
  storageBucket: "roadsafe-bb4be.appspot.com",
  messagingSenderId: "904816955258",
  appId: "1:904816955258:web:05f31f02b7cfcbe37e90c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Enable persistent login
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase Auth persistence enabled.");
  })
  .catch((error) => {
    console.error("Error enabling persistence:", error);
  });

export { auth };
