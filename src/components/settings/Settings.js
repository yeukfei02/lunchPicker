import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import _ from 'lodash';
import axios from 'axios';

import Snackbar from '../snackBar/SnackBar';

import {
  getRootUrl,
  log
} from '../../common/Common';

const ROOT_URL = getRootUrl();

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function Settings() {
  const classes = useStyles();

  const [subscribeStatus, setSubscribeStatus] = useState(true);

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [message, setMessage] = useState('');

  const currentToken = localStorage.getItem('firebaseCurrentToken');

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
