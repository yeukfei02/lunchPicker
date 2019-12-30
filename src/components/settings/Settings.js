import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
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

  const [currentToken, setCurrentToken] = useState('');
  const [refreshedToken, setRefreshedToken] = useState('');
  const [subscribe, setSubscribe] = useState(true);

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (_.isEqual(permission, 'granted')) {
        log('Notification permission granted.', "");

        getToken(messaging);
        onTokenRefresh(messaging);
        receiveMessage(messaging);
      } else {
        log('Unable to get permission to notify.', "");
      }
    });
  }, []);

  const getToken = (messaging) => {
    messaging.getToken()
      .then((currentToken) => {
        if (currentToken) {
          log("currentToken = ", currentToken);
          setCurrentToken(currentToken);
          // sendTokenToServer(currentToken);
          // updateUIForPushEnabled(currentToken);
        } else {
          log('No Instance ID token available. Request permission to generate one.', '');
          // Show permission UI.
          // updateUIForPushPermissionRequired();
          // setTokenSentToServer(false);
        }
      })
      .catch((err) => {
        log('An error occurred while retrieving token.', err);
        // showToken('Error retrieving Instance ID token. ', err);
        // setTokenSentToServer(false);
      });
  }

  const onTokenRefresh = (messaging) =>
    messaging.onTokenRefresh(() => {
      messaging.getToken()
        .then((refreshedToken) => {
          log("refreshedToken = ", refreshedToken);
          setRefreshedToken(refreshedToken);
          // setTokenSentToServer(false);
          // sendTokenToServer(refreshedToken);
        })
        .catch((err) => {
          log('Unable to retrieve refreshed token ', err);
        });
    });

  const receiveMessage = (messaging) => {
    messaging.onMessage((payload) => {
      log('payload = ', payload);

      // Customize notification here
      const notificationTitle = 'Background Message Title';
      const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
      };

      return window.registration.showNotification(notificationTitle, notificationOptions);
    });
  }

  const handleSwitchChange = (e) => {
    setSubscribe(e.target.checked);
  }

  return (
    <div className="mt-5 d-flex justify-content-center">
      <Paper className={`${classes.root} mx-4 w-75`}>
        <div>
          <h5 className="mb-3">Settings</h5>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch checked={subscribe} color="primary" onChange={(e) => handleSwitchChange(e)} value="subscribe" />
              }
              label="Subscribe message"
            />
          </FormGroup>
        </div>
      </Paper>
    </div>
  )
}

export default Settings;
