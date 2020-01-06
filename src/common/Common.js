// import { Timber } from "@timberio/browser";

export const getFirebaseConfig = () => {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  };
  return firebaseConfig;
}

export const getStripeApiKey = () => {
  let result = '';

  if (window.location.href.includes('localhost')) {
    result = process.env.REACT_APP_STRIPE_TEST_API_KEY;
  } else {
    result = process.env.REACT_APP_STRIPE_API_KEY;
  }

  return result;
}

export const getRootUrl = () => {
  let ROOT_URL = '';
  if (window.location.href.includes('localhost')) {
    ROOT_URL = "http://localhost:3000/api";
  } else {
    ROOT_URL = "https://lunch-picker-api.herokuapp.com/api";
  }

  return ROOT_URL;
}

export const log = (message, item) => {
  console.log(message, item);

  // timber
  // const environment = process.env.NODE_ENV;
  // if (environment !== 'development') {
  //   const timber = new Timber(process.env.REACT_APP_TIMBER_API_KEY, process.env.REACT_APP_TIMBER_SOURCE_ID);
  //   if (typeof item === 'object') {
  //     timber.log(`${message} ${JSON.stringify(item)}`);
  //   } else if (typeof item === 'string') {
  //     timber.log(`${message} ${item}`);
  //   }
  // }
}
