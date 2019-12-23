import React from 'react';
import Normalize from 'react-normalize';
import Favicon from 'react-favicon';
import favicon from '../images/favicon.ico';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import NavBar from './navBar/NavBar';
import MainPage from './mainPage/MainPage';
import Contact from './contact/Contact';

function App() {
  return (
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
  )
}

export default App;
