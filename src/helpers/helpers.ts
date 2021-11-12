interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  databaseURL: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  measurementId: string | undefined;
}

export const getFirebaseConfig = (): FirebaseConfig => {
  const firebaseConfig = {
    apiKey: process.env['REACT_APP_FIREBASE_API_KEY'],
    authDomain: process.env['REACT_APP_FIREBASE_AUTH_DOMAIN'],
    databaseURL: process.env['REACT_APP_FIREBASE_DATABASE_URL'],
    projectId: process.env['REACT_APP_FIREBASE_PROJECT_ID'],
    storageBucket: process.env['REACT_APP_FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: process.env['REACT_APP_FIREBASE_MESSAGING_SENDER_ID'],
    appId: process.env['REACT_APP_FIREBASE_APP_ID'],
    measurementId: process.env['REACT_APP_FIREBASE_MEASUREMENT_ID'],
  };
  return firebaseConfig;
};

export const getStripeApiKey = (): string | undefined => {
  let result: string | undefined = '';

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    result = process.env['REACT_APP_STRIPE_TEST_API_KEY'];
  } else {
    result = process.env['REACT_APP_STRIPE_API_KEY'];
  }

  return result;
};

export const getRootUrl = (): string => {
  let rootUrl = '';

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    rootUrl = 'http://localhost:3000/api';
  } else {
    rootUrl = 'https://www.lunch-picker-api.com/api';
  }

  return rootUrl;
};
