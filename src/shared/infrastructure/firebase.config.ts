import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD3Jz84KNec0Rpbll8R5k3QsJu9IpDQHtg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'smartfinance-28ec1.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'smartfinance-28ec1',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'smartfinance-28ec1.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '528217951551',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:528217951551:web:3117b2710b405b613d978a'
}

export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp()
  }
  return initializeApp(firebaseConfig)
}

export function getFirebaseAuth(): Auth {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  auth.languageCode = 'es'
  return auth
}
