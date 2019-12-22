import React, { Component } from 'react';
import Normalize from 'react-normalize';
import Favicon from 'react-favicon';
import favicon from '../images/favicon.png';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import NavBar from './navBar/NavBar';

class App extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <Router>
        <Normalize />
        <Favicon url={favicon} />
        <NavBar />

        <Switch>
          <Route path="/contact">
            <div>contact us</div>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
