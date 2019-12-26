
export const getSentryDsn = () => {
  return "https://cec048889fd24614ba09d28c53f358d4@sentry.io/1866688";
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
