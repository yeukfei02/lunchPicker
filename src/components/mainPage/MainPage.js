import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import _ from 'lodash';
import axios from 'axios';

function MainPage() {
  const [selectedTermList, setSelectedTermList] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [useLocation, setUseLocation] = useState(false);
  const [useLatLong, setUseLatLong] = useState(false);

  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [resultList, setResultList] = useState([]);

  useEffect(() => {
    getSelectedTermList();
    getUserCurrentLatLong();
  }, []);

  const getSelectedTermList = async () => {
    const response = await axios.get(
      `https://lunch-picker-api.herokuapp.com/api/category/get-categories`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (!_.isEmpty(response)) {
      console.log("response = ", response);
      if (!_.isEmpty(response.data.categories.categories)) {
        let selectedTermList = [];
        response.data.categories.categories.forEach((item, i) => {
          if (!_.isEmpty(item.parent_aliases)) {
            const parentAliases = item.parent_aliases[0];
            if (_.isEqual(parentAliases, "food") || _.isEqual(parentAliases, "restaurants") || _.isEqual(parentAliases, "bars") || _.isEqual(parentAliases, "breakfast_brunch")) {
              selectedTermList.push(item);
            }
          }
        });

        if (!_.isEmpty(selectedTermList)) {
          const formattedSelectedTermList = selectedTermList.map((item, i) => {
            const obj = {
              value: item.alias,
              label: item.title
            }
            return obj
          });
          setSelectedTermList(formattedSelectedTermList);
        }
      }
    }
  }

  const getUserCurrentLatLong = () => {
    navigator.geolocation.getCurrentPosition((location) => {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      setLatitude(latitude);
      setLongitude(longitude);
    });
  }

  const findRestaurantsByLocation = async (selectedTerm, location) => {
    const response = await axios.get(
      `https://lunch-picker-api.herokuapp.com/api/restaurant/find-restaurants-by-location`,
      {
        params: {
          term: selectedTerm.label,
          location: location
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (!_.isEmpty(response)) {
      console.log("response = ", response);
      setResultList(response.data.restaurants.businesses);
    }
  }

  const findRestaurantsByLatLong = async (selectedTerm, latitude, longitude) => {
    const response = await axios.get(
      `https://lunch-picker-api.herokuapp.com/api/restaurant/find-restaurants-by-lat-long`,
      {
        params: {
          term: selectedTerm.label,
          latitude: latitude,
          longitude: longitude
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (!_.isEmpty(response)) {
      console.log("response = ", response);
      setResultList(response.data.restaurants.businesses);
    }
  }

  const handleChange = (selectedTerm) => {
    setSelectedTerm(selectedTerm);
  };

  const handleCheckboxChange = type => e => {
    if (_.isEqual(type, 'useLocation')) {
      setUseLocation(e.target.checked);
    } else if (_.isEqual(type, 'useLatLong')) {
      setUseLatLong(e.target.checked);
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  }

  const handleLatitudeChange = (e) => {
    setLatitude(e.target.value);
  }

  const handleLongitudeChange = (e) => {
    setLongitude(e.target.value);
  }

  const renderSelectDropdown = () => {
    let selectDropdown = null;

    if (_.isEqual(window.location.pathname, '/')) {
      selectDropdown = (
        <div>
          <Select
            value={selectedTerm}
            onChange={handleChange}
            options={selectedTermList}
            isClearable={true}
          />
          <div className="my-3"></div>
        </div>
      );
    }

    return selectDropdown;
  }

  const renderCheckbox = () => {
    let checkboxDiv = null;

    if (!_.isEmpty(selectedTerm)) {
      checkboxDiv = (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={useLocation}
                onChange={handleCheckboxChange('useLocation')}
                value="Use Location"
                disabled={useLatLong ? true : false}
              />
            }
            label="Use Location"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={useLatLong}
                onChange={handleCheckboxChange('useLatLong')}
                value="Use Latitude and Longitude"
                disabled={useLocation ? true : false}
              />
            }
            label="Use Latitude and Longitude"
          />
        </div>
      );
    }

    return checkboxDiv;
  }

  const renderLocationInput = () => {
    let locationInput = null;

    if (!_.isEmpty(selectedTerm) && useLocation === true) {
      locationInput = (
        <div>
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
            onChange={handleLocationChange}
          />
          <div className="my-3"></div>
        </div>
      );
    }

    return locationInput;
  }

  const renderLatitudeAndLongitudeInput = () => {
    let latitudeAndLongitudeInput = null;

    if (!_.isEmpty(selectedTerm) && useLatLong === true) {
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
            value={latitude}
            onChange={handleLatitudeChange}
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
            value={longitude}
            onChange={handleLongitudeChange}
          />
          <div className="my-3"></div>
        </div>
      );
    }

    return latitudeAndLongitudeInput;
  }

  const renderSubmitButton = () => {
    let submitButton = null;

    if (!_.isEmpty(selectedTerm)) {
      if (useLocation === true) {
        if (!_.isEmpty(location)) {
          submitButton = (
            <Button className="w-100" variant="outlined" color="secondary" onClick={handleSubmit}>
              Submit
            </Button>
          );
        }
      }

      if (useLatLong === true) {
        submitButton = (
          <Button className="w-100" variant="outlined" color="secondary" onClick={handleSubmit}>
            Submit
          </Button>
        );
      }
    }

    return submitButton;
  }

  const handleSubmit = () => {
    if (!_.isEmpty(selectedTerm)) {
      if (useLocation === true) {
        if (!_.isEmpty(location)) {
          findRestaurantsByLocation(selectedTerm, location);
        }
      }

      if (useLatLong === true) {
        if (!_.isEmpty(latitude) && !_.isEmpty(longitude)) {
          findRestaurantsByLatLong(selectedTerm, latitude, longitude);
        }
      }
    }
  }

  return (
    <div className="mt-5 d-flex justify-content-center">
      <div className="w-75">
        {renderSelectDropdown()}
        {renderCheckbox()}
        {renderLocationInput()}
        {renderLatitudeAndLongitudeInput()}
        {renderSubmitButton()}
      </div>
    </div>
  );
}

export default MainPage;
