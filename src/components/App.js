import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Normalize from 'react-normalize';
import Favicon from 'react-favicon';
import favicon from '../images/favicon.ico';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  Switch,
  Route
} from "react-router-dom";
import ReactGA from 'react-ga';
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/messaging";
import _ from 'lodash';
import axios from 'axios';

import NavBar from './navBar/NavBar';
import MainPage from './mainPage/MainPage';
import RandomFood from './randomFood/RandomFood';
import RandomFoodMapView from './randomFoodMapView/RandomFoodMapView';
import Favourites from './favourites/Favourites';
import Settings from './settings/Settings';
import Contact from './contact/Contact';
import RestaurantDetails from './restaurantDetails/RestaurantDetails';

import {
  getGoogleAnalyticsId,
  getFirebaseConfig,
  getFirebaseWebPushCertificates,
  getRootUrl,
  log
} from '../common/Common';

const ROOT_URL = getRootUrl();

// use default theme
// const theme = createMuiTheme();

// create own theme
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ed1f30'
    },
    secondary: {
      main: '#2b76f0'
    },
    background: {
      default: "#FAFAD2"
    }
  }
},
)

// google analytic
ReactGA.initialize(getGoogleAnalyticsId());

// firebase
const firebaseConfig = getFirebaseConfig();
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.usePublicVapidKey(getFirebaseWebPushCertificates());

function App() {
  const location = useLocation();

  const [currentToken, setCurrentToken] = useState('');
  const [refreshedToken, setRefreshedToken] = useState('');

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (_.isEqual(permission, 'granted')) {
        log('Notification permission granted.', "");

        getToken(messaging);
        onTokenRefresh(messaging);
      } else {
        log('Unable to get permission to notify.', "");
      }
    });
  }, []);

  useEffect(() => {
    if (!_.isEmpty(currentToken) || !_.isEmpty(refreshedToken)) {
      addTokenToServer(currentToken, refreshedToken);
      subscribeTopic(currentToken);
    }
  }, [currentToken, refreshedToken]);

  useEffect(() => {
    ReactGA.pageview(location.pathname);
  }, [location.pathname]);

  const getToken = (messaging) => {
    messaging.getToken()
      .then((currentToken) => {
        if (currentToken) {
          log("currentToken = ", currentToken);
          localStorage.setItem('firebaseCurrentToken', currentToken);
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
          localStorage.setItem('firebaseRefreshedToken', refreshedToken);
          setRefreshedToken(refreshedToken);
        })
        .catch((err) => {
          log('Unable to retrieve refreshed token ', err);
        });
    });

  const addTokenToServer = (currentToken, refreshedToken) => {
    axios.post(
      `${ROOT_URL}/firebase/add-token-to-server`,
      {
        currentToken: currentToken,
        refreshedToken: refreshedToken
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

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Normalize />
      <Favicon url={favicon} />
      <NavBar />

      <Switch>
        <Route exact path="/">
          <MainPage />
        </Route>
        <Route exact path="/random-food">
          <RandomFood />
        </Route>
        <Route exact path="/random-food-map-view">
          <RandomFoodMapView />
        </Route>
        <Route exact path="/favourites">
          <Favourites />
        </Route>
        <Route exact path="/settings">
          <Settings />
        </Route>
        <Route exact path="/contact">
          <Contact />
        </Route>
        <Route exact path="/restaurant-details/:id">
          <RestaurantDetails />
        </Route>
      </Switch>
    </MuiThemeProvider>
  )
}

export default App;
