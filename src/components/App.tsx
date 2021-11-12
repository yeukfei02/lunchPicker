import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Normalize from 'react-normalize';
import Favicon from 'react-favicon';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Switch, Route } from 'react-router-dom';
import ReactGA from 'react-ga';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/messaging';
import _ from 'lodash';
import axios from 'axios';
import is from 'is_js';

import NavBar from './navBar/NavBar';
import MainPage from './mainPage/MainPage';
import RandomFood from './randomFood/RandomFood';
import RandomFoodMapView from './randomFoodMapView/RandomFoodMapView';
import Favourites from './favourites/Favourites';
import Settings from './settings/Settings';
import Contact from './contact/Contact';
import RestaurantDetails from './restaurantDetails/RestaurantDetails';

import { getFirebaseConfig, getRootUrl } from '../helpers/helpers';

const rootUrl = getRootUrl();

// use default theme
// const theme = createMuiTheme();

// create own theme
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ed1f30',
    },
    secondary: {
      main: '#2b76f0',
    },
    background: {
      default: '#FAFAD2',
    },
  },
  typography: {
    fontFamily: 'Ubuntu, sans-serif',
  },
});

// google analytic
const trackingCode: string = process.env['REACT_APP_GOOGLE_ANALYTICS_ID']
  ? process.env['REACT_APP_GOOGLE_ANALYTICS_ID']
  : '';
ReactGA.initialize(trackingCode);

// firebase
let messaging: any = null;

const isDesktop = is.desktop();
const isAndroid = is.android();
if (isDesktop || isAndroid) {
  // chrome or firefox
  const isNotSafari = is.not.safari();
  if (isNotSafari) {
    const firebaseConfig = getFirebaseConfig();
    firebase.initializeApp(firebaseConfig);

    messaging = firebase.messaging();
    messaging.usePublicVapidKey(process.env['REACT_APP_FIREBASE_WEB_PUSH_CERTIFICATES']);
  }
}

function App(): JSX.Element {
  const location = useLocation();

  const [currentToken, setCurrentToken] = useState<string>('');
  const [refreshedToken, setRefreshedToken] = useState<string>('');

  useEffect(() => {
    if (!_.isEmpty(messaging)) {
      Notification.requestPermission().then((permission: any) => {
        if (_.isEqual(permission, 'granted')) {
          console.log('Notification permission granted.');

          getToken(messaging);
          onTokenRefresh(messaging);
        } else {
          console.log('Unable to get permission to notify.');
        }
      });
    }
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

  const getToken = (messaging: any) => {
    messaging
      .getToken()
      .then((currentToken: string) => {
        if (currentToken) {
          console.log('currentToken = ', currentToken);
          localStorage.setItem('firebaseCurrentToken', currentToken);
          setCurrentToken(currentToken);
        } else {
          console.log('No Instance ID token available. Request permission to generate one.');
        }
      })
      .catch((err: any) => {
        console.log('An error occurred while retrieving token.', err);
      });
  };

  const onTokenRefresh = (messaging: any) =>
    messaging.onTokenRefresh(() => {
      messaging
        .getToken()
        .then((refreshedToken: string) => {
          console.log('refreshedToken = ', refreshedToken);
          localStorage.setItem('firebaseRefreshedToken', refreshedToken);
          setRefreshedToken(refreshedToken);
        })
        .catch((err: any) => {
          console.log('Unable to retrieve refreshed token ', err);
        });
    });

  const addTokenToServer = async (currentToken: string, refreshedToken: string) => {
    const response = await axios.post(
      `${rootUrl}/firebase/add-token-to-server`,
      {
        currentToken: currentToken,
        refreshedToken: refreshedToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
    }
  };

  const subscribeTopic = async (currentToken: string) => {
    const response = await axios.post(
      `${rootUrl}/firebase/subscribe-topic`,
      {
        currentTokenList: [currentToken],
        topic: 'all',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Normalize />
      <Favicon url={require('../images/favicon.ico')} />
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
  );
}

export default App;
