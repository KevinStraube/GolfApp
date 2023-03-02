import { getApps, initializeApp, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

const FIREBASE_VAPID_KEY = "BHC05pvWI7f9f9wWsXpkDxa-FNoh8E2yjochJiDzhH4atsRVdb1zvrcS7RVPz7_XDpGzBJedO7zfKnVS00aCQco";

const firebaseConfig = {
  apiKey: "AIzaSyB2_QsBxQTljoHTVv9mn-u3nqD0qTYDjVE",
  authDomain: "golfapp-ca492.firebaseapp.com",
  projectId: "golfapp-ca492",
  storageBucket: "golfapp-ca492.appspot.com",
  messagingSenderId: "1013459442897",
  appId: "1:1013459442897:web:3cf1564b1e72096653f9f0",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const messaging = (async () => {
    try {
        const isSupportedBrowser = await isSupported();
        if (isSupportedBrowser) {
            return getMessaging(app);
        }
        console.log("Firebase is not supported in this browser");
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
})();

export { app, firestore, auth, storage, messaging }