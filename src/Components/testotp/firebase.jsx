// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { getDatabase, ref, set, get } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAjSyB4JE-AQX--imujZQGbv-f2XKEkNiY",
  authDomain: "kuromi-store-66689.firebaseapp.com",
  projectId: "kuromi-store-66689",
  storageBucket: "kuromi-store-66689.appspot.com",
  messagingSenderId: "112710566482",
  appId: "1:112710566482:web:6d0cbb337ae9e2d9d9558b",
  measurementId: "G-677DSV7Q8L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);
const imageDb = getStorage(app)

export {auth, provider, imageDb, database};
