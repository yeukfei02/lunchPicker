import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import * as Sentry from '@sentry/browser';
import { Timber } from "@timberio/browser";

import {
  getSentryDsn,
  getTimberApiKey,
  getTimberSouceId
} from './common/Common';

// sentry
Sentry.init({ dsn: getSentryDsn() });

// timber
const timber = new Timber(getTimberApiKey(), getTimberSouceId());
timber.log("timber log start");

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
