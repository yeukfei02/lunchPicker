import React, { Component } from 'react';
import Select from 'react-select';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import _ from 'lodash';

class MainPage extends Component {
  constructor() {
    super();
    this.state = {
      selectedTerm: null,
      useLocation: false,
      useLatLong: false,

      location: '',
      latitude: '',
      longitude: ''
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((location) => {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      this.setState({
        latitude: latitude,
        longitude: longitude
      });
    });
  }

  handleChange = (selectedTerm) => {
    this.setState({
      selectedTerm: selectedTerm
    });
  };

  handleLocationChange(e) {
    this.setState({
      location: e.target.value
    });
  }

  handleLatitudeChange(e) {
    this.setState({
      latitude: e.target.value
    });
  }

  handleLongitudeChange(e) {
    this.setState({
      longitude: e.target.value
    });
  }

  handleCheckboxChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  renderCheckbox() {
    let checkboxDiv = null;

    if (!_.isEmpty(this.state.selectedTerm)) {
      checkboxDiv = (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.useLocation}
                onChange={this.handleCheckboxChange('useLocation')}
                value="Use Location"
                disabled={this.state.useLatLong ? true : false}
              />
            }
            label="Use Location"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.useLatLong}
                onChange={this.handleCheckboxChange('useLatLong')}
                value="Use Latitude and Longitude"
                disabled={this.state.useLocation ? true : false}
              />
            }
            label="Use Latitude and Longitude"
          />
        </div>
      );
    }

    return checkboxDiv;
  }

  renderLocationInput() {
    let locationInput = null;

    if (!_.isEmpty(this.state.selectedTerm) && this.state.useLocation === true) {
      locationInput = (
        <TextField
          id="outlined-full-width"
          label="Location"
          placeholder="Enter location..."
          helperText="address, city, place, street name, zip code, country, state, building name, etc..."
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => this.handleLocationChange(e)}
        />
      );
    }

    return locationInput;
  }

  renderLatitudeAndLongitudeInput() {
    let latitudeAndLongitudeInput = null;

    if (!_.isEmpty(this.state.selectedTerm) && this.state.useLatLong === true) {
      latitudeAndLongitudeInput = (
        <div>
          <TextField
            id="outlined-full-width"
            label="Latitude"
            placeholder="Enter latitude..."
            type="number"
            helperText="your current latitude"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={this.state.latitude}
            onChange={(e) => this.handleLatitudeChange(e)}
          />
          <TextField
            id="outlined-full-width"
            label="Longitude"
            placeholder="Enter longitude..."
            type="number"
            helperText="your current longitude"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={this.state.longitude}
            onChange={(e) => this.handleLongitudeChange(e)}
          />
        </div>
      );
    }

    return latitudeAndLongitudeInput;
  }

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
            value={this.state.selectedTerm}
            onChange={this.handleChange}
            options={options}
            isClearable={true}
          />
          <div className="my-3"></div>
          {this.renderCheckbox()}
          {this.renderLocationInput()}
          {this.renderLatitudeAndLongitudeInput()}
        </div>
      </div>
    );
  }
}

export default MainPage;
