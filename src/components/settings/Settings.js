import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
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

const selectStyles = {
  container: (base, state) => ({
    ...base,
    opacity: state.isDisabled ? ".5" : "1",
    backgroundColor: "transparent",
    zIndex: "999"
  })
};

function Settings() {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  let defaultLanguage = {};
  if (!_.isEmpty(i18n.language)) {
    switch (i18n.language) {
      case 'eng':
        defaultLanguage = { value: i18n.language, label: t('english') };
        break;
      case 'chi':
        defaultLanguage = { value: i18n.language, label: t('chinese') };
        break;
      default:
        defaultLanguage = { value: 'eng', label: t('english') };
        break;
    }
  }

  const [subscribeStatus, setSubscribeStatus] = useState(true);

  const [languageList, setLanguageList] = useState([]);
  const [language, setLanguage] = useState(defaultLanguage);

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [message, setMessage] = useState('');

  const currentToken = localStorage.getItem('firebaseCurrentToken');

  useEffect(() => {
    getLanguageList(t);
  }, [t]);

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

  const getLanguageList = (t) => {
    const languageList = [
      { value: 'eng', label: t('english') },
      { value: 'chi', label: t('chinese') },
    ];
    setLanguageList(languageList);
  }

  const handleLanguageChange = (selectedLanguage) => {
    if (!_.isEmpty(selectedLanguage)) {
      setLanguage(selectedLanguage);
      i18n.changeLanguage(selectedLanguage.value);
    }
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
          <h5 className="mb-3">{t('setting')}</h5>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch checked={subscribeStatus} color="primary" onChange={(e) => handleSwitchChange(e)} value="subscribeStatus" />
              }
              label={t('subscribeMessage')}
            />
          </FormGroup>
          <h5 className="my-3">{t('changeLanguage')}</h5>
          <Select
            styles={selectStyles}
            placeholder={t('selectLanguage')}
            value={language}
            onChange={handleLanguageChange}
            options={languageList}
            isClearable={true}
          />
        </div>
      </Paper>
      <Snackbar openSuccessAlert={openSuccessAlert} message={message} />
    </div>
  )
}

export default Settings;
