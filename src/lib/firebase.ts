import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const canInitializeClient =
  typeof window !== "undefined" && Boolean(firebaseConfig.apiKey);

// Initialize Firebase only in the browser with a valid API key (prevents static prerender crashes)
const app: FirebaseApp = canInitializeClient
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : (null as unknown as FirebaseApp);

const auth: Auth = canInitializeClient
  ? getAuth(app)
  : (null as unknown as Auth);
const googleProvider = new GoogleAuthProvider();
const db: Firestore = canInitializeClient
  ? getFirestore(app)
  : (null as unknown as Firestore);
const storage: FirebaseStorage = canInitializeClient
  ? getStorage(app)
  : (null as unknown as FirebaseStorage);

// Initialize Analytics only in supported browser environments
const analytics =
  canInitializeClient
    ? isSupported().then((yes) => (yes ? getAnalytics(app) : null))
    : null;

export { app, auth, googleProvider, db, storage, analytics };
