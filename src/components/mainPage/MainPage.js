import React, { Component } from 'react';
import Select from 'react-select';

class MainPage extends Component {
  constructor() {
    super();
    this.state = {
      selectedOption: null,
    };
  }

  componentDidMount() {

  }

  handleChange = (selectedOption) => {
    this.setState({
      selectedOption: selectedOption
    });
  };

  render() {
    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' },
    ];

    return (
      <div className="mt-5 d-flex justify-content-center">
        <div className="w-75">
          <Select
            value={this.state.selectedOption}
            onChange={this.handleChange}
            options={options}
            isClearable={true}
          />
        </div>
      </div>
    );
  }
}

export default MainPage;
