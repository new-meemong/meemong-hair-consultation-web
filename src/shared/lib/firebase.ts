import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
// Import the functions you need from the SDKs you need
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore';
import { getApps, initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAszQxVWw1sap2X6EWsjErAuVpC1t1Rvic',
  authDomain: 'new-meemong.firebaseapp.com',
  projectId: 'new-meemong',
  storageBucket: 'new-meemong.firebasestorage.app',
  messagingSenderId: '425261596153',
  appId: '1:425261596153:web:2b2cab0df9ee1b2e979128',
  measurementId: 'G-RHKCZXCFQ5',
};

// Firebase 초기화
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app, 'meemong-chat');

// Analytics는 클라이언트 사이드에서만 초기화
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((yes) => yes && (analytics = getAnalytics(app)));
}

export { app, db, analytics };
