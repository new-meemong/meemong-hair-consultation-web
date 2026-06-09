import { type Analytics, getAnalytics, initializeAnalytics, isSupported } from 'firebase/analytics';
// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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
const normalizedApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
const firestoreDatabaseId =
  normalizedApiUrl === 'https://api.meemong.com' ? 'meemong-chat' : 'meemong-dev';
const db = getFirestore(app, firestoreDatabaseId);

// Analytics는 클라이언트 사이드에서만 초기화
let analytics: Analytics | null = null;
let analyticsPromise: Promise<Analytics | null> | null = null;

function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (analytics) {
    return Promise.resolve(analytics);
  }

  analyticsPromise ??= isSupported()
    .then((yes) => {
      if (!yes) return null;

      try {
        analytics = initializeAnalytics(app, {
          config: {
            send_page_view: false,
          },
        });
      } catch {
        analytics = getAnalytics(app);
      }

      return analytics;
    })
    .catch(() => null);

  return analyticsPromise;
}

if (typeof window !== 'undefined') {
  void getFirebaseAnalytics();
}

export { analytics, app, db, getFirebaseAnalytics };
