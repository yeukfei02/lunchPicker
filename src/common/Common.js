import { Timber } from "@timberio/browser";

export const getSentryDsn = () => {
  return "https://cec048889fd24614ba09d28c53f358d4@sentry.io/1866688";
}

export const getTimberApiKey = () => {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2FwaS50aW1iZXIuaW8vIiwiZXhwIjpudWxsLCJpYXQiOjE1NzczNjU3NjcsImlzcyI6Imh0dHBzOi8vYXBpLnRpbWJlci5pby9hcGlfa2V5cyIsInByb3ZpZGVyX2NsYWltcyI6eyJhcGlfa2V5X2lkIjo1ODU3LCJ1c2VyX2lkIjoiYXBpX2tleXw1ODU3In0sInN1YiI6ImFwaV9rZXl8NTg1NyJ9.FQQwOgQqg2lKSnlQfJlc4Nakc4Xe_DUXk87n9pr63dg";
}

export const getTimberSouceId = () => {
  return "30675";
}

export const getGoogleAnalyticsId = () => {
  return "UA-107755270-2";
}

export const getFirebaseConfig = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyD55je9pcQGJ96G-V6NYjAbNkcLMlXsE9A",
    authDomain: "lunchpicker-2232b.firebaseapp.com",
    databaseURL: "https://lunchpicker-2232b.firebaseio.com",
    projectId: "lunchpicker-2232b",
    storageBucket: "lunchpicker-2232b.appspot.com",
    messagingSenderId: "504803962297",
    appId: "1:504803962297:web:0e92e242eb0375414ada68",
    measurementId: "G-H20YZMFE14"
  };
  return firebaseConfig;
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
  const timber = new Timber(getTimberApiKey(), getTimberSouceId());
  if (typeof item === 'object') {
    timber.log(`${message} ${JSON.stringify(item)}`);
  } else if (typeof item === 'string') {
    timber.log(`${message} ${item}`);
  }
}
