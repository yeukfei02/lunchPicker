import React from 'react';
import Normalize from 'react-normalize';
import Favicon from 'react-favicon';
import favicon from '../images/favicon.ico';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import NavBar from './navBar/NavBar';
import MainPage from './mainPage/MainPage';
import Contact from './contact/Contact';

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
  }
},
)

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Normalize />
        <Favicon url={favicon} />
        <NavBar />

        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route exact path="/contact">
            <Contact />
          </Route>
        </Switch>
      </Router>
    </MuiThemeProvider>
  )
}

export default App;
