import React, { Component } from 'react';
import Normalize from 'react-normalize';
import Favicon from 'react-favicon';
import favicon from '../images/favicon.png';

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
      <div>
        <Normalize />
        <Favicon url={favicon} />
        <NavBar />
      </div>
    );
  }
}

export default App;
