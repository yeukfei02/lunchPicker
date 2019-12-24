import React from 'react';
import Normalize from 'react-normalize';
import Favicon from 'react-favicon';
import favicon from '../images/favicon.ico';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import NavBar from './navBar/NavBar';
import MainPage from './mainPage/MainPage';
import RandomFood from './randomFood/RandomFood';
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
    background: {
      default: "#FAFAD2"
    }
  }
},
)

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
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
          <Route exact path="/contact">
            <Contact />
          </Route>
        </Switch>
      </Router>
    </MuiThemeProvider>
  )
}

export default App;
