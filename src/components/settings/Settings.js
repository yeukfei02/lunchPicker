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
import axios from 'axios';

import Snackbar from '../snackBar/SnackBar';

import {
  getFirebaseConfig,
  getFirebaseWebPushCertificates,
  getRootUrl,
  log
} from '../../common/Common';

const ROOT_URL = getRootUrl();

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
  const [subscribeStatus, setSubscribeStatus] = useState(true);

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    if (!_.isEmpty(currentToken)) {
      if (subscribeStatus === true)
        subscribeTopic(currentToken);
      else
        unsubscribeTopic(currentToken);
    }
  }, [subscribeStatus, currentToken]);

  useEffect(() => {
    if (openSuccessAlert === true) {
      setOpenSuccessAlert(false);
    }
    if (!_.isEmpty(message)) {
      setMessage('');
    }
  }, [openSuccessAlert, message]);

  const getToken = (messaging) => {
    messaging.getToken()
      .then((currentToken) => {
        if (currentToken) {
          log("currentToken = ", currentToken);
          setCurrentToken(currentToken);
        } else {
          log('No Instance ID token available. Request permission to generate one.', '');
        }
      })
      .catch((err) => {
        log('An error occurred while retrieving token.', err);
      });
  }

  const onTokenRefresh = (messaging) =>
    messaging.onTokenRefresh(() => {
      messaging.getToken()
        .then((refreshedToken) => {
          log("refreshedToken = ", refreshedToken);
          setRefreshedToken(refreshedToken);
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
    setSubscribeStatus(e.target.checked);

    setOpenSuccessAlert(true);
    if (e.target.checked === true) {
      setMessage('Subscribe message success!');
    } else {
      setMessage('Unsubscribe message success!');
    }
  }

  const subscribeTopic = (currentToken) => {
    axios.post(
      `${ROOT_URL}/firebase/subscribe-topic`,
      {
        currentTokenList: [currentToken],
        topic: "all"
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
        }
      });
  }

  const unsubscribeTopic = (currentToken) => {
    axios.post(
      `${ROOT_URL}/firebase/unsubscribe-topic`,
      {
        currentTokenList: [currentToken],
        topic: "all"
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
        }
      });
  }

  return (
    <div className="mt-5 d-flex justify-content-center">
      <Paper className={`${classes.root} mx-4 w-75`}>
        <div>
          <h5 className="mb-3">Settings</h5>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch checked={subscribeStatus} color="primary" onChange={(e) => handleSwitchChange(e)} value="subscribeStatus" />
              }
              label="Subscribe message"
            />
          </FormGroup>
        </div>
      </Paper>
      <Snackbar openSuccessAlert={openSuccessAlert} message={message} />
    </div>
  )
}

export default Settings;
