import React, { useEffect } from 'react';
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

import NavBar from './navBar/NavBar';
import MainPage from './mainPage/MainPage';
import RandomFood from './randomFood/RandomFood';
import RandomFoodMapView from './randomFoodMapView/RandomFoodMapView';
import Favourites from './favourites/Favourites';
import Settings from './settings/Settings';
import Contact from './contact/Contact';
import RestaurantDetails from './restaurantDetails/RestaurantDetails';

import { getGoogleAnalyticsId } from '../common/Common';

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

function App() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(location.pathname);
  }, [location.pathname]);

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
