import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB2_QsBxQTljoHTVv9mn-u3nqD0qTYDjVE",
  authDomain: "golfapp-ca492.firebaseapp.com",
  projectId: "golfapp-ca492",
  storageBucket: "golfapp-ca492.appspot.com",
  messagingSenderId: "1013459442897",
  appId: "1:1013459442897:web:3cf1564b1e72096653f9f0",
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApps();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, firestore, auth, storage }