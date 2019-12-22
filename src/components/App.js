import React, { Component } from 'react';
import Normalize from 'react-normalize';
import Favicon from 'react-favicon';
import favicon from '../images/favicon.png';

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
        Lunch Picker
      </div>
    );
  }
}

export default App;
