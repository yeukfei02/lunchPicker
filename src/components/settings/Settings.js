import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/messaging";
import _ from 'lodash';

import {
  getFirebaseConfig,
  getFirebaseWebPushCertificates,
  log
} from '../../common/Common';

// firebase
const firebaseConfig = getFirebaseConfig();
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.usePublicVapidKey(getFirebaseWebPushCertificates());

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function Settings() {
  const classes = useStyles();

  useEffect(() => {
    callFirebase();
  }, []);

  const callFirebase = () => {
    Notification.requestPermission().then((permission) => {
      if (_.isEqual(permission, 'granted')) {
        log('Notification permission granted.', "");

        getToken(messaging);
        onTokenRefresh(messaging);
      } else {
        log('Unable to get permission to notify.', "");
      }
    });
  }

  const getToken = (messaging) => {
    messaging.getToken()
      .then((currentToken) => {
        if (currentToken) {
          console.log("currentToken = ", currentToken);
          // sendTokenToServer(currentToken);
          // updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log('No Instance ID token available. Request permission to generate one.');
          // Show permission UI.
          // updateUIForPushPermissionRequired();
          // setTokenSentToServer(false);
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // showToken('Error retrieving Instance ID token. ', err);
        // setTokenSentToServer(false);
      });
  }

  const onTokenRefresh = (messaging) =>
    messaging.onTokenRefresh(() => {
      messaging.getToken()
        .then((refreshedToken) => {
          console.log('Token refreshed.');
          console.log("refreshedToken = ", refreshedToken)
          // Indicate that the new Instance ID token has not yet been sent to the
          // app server.
          // setTokenSentToServer(false);
          // // Send Instance ID token to app server.
          // sendTokenToServer(refreshedToken);
          // ...
        })
        .catch((err) => {
          console.log('Unable to retrieve refreshed token ', err);
          // showToken('Unable to retrieve refreshed token ', err);
        });
    });

  return (
    <div className="mt-5 d-flex justify-content-center">
      <Paper className={`${classes.root} mx-4 w-75`}>
        <div>
          <h5 className="mb-3">Settings</h5>
        </div>
      </Paper>
    </div>
  )
}

export default Settings;
