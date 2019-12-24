import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Select from 'react-select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import _ from 'lodash';
import axios from 'axios';

import logo from '../../images/logo.png';
import Snackbar from '../snackBar/SnackBar';

const ROOT_URL = "https://lunch-picker-api.herokuapp.com";

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function MainPage() {
  const classes = useStyles();

  const [selectedTermList, setSelectedTermList] = useState([]);

  const [selectedTerm, setSelectedTerm] = useState(null);
  const [useLocation, setUseLocation] = useState(false);
  const [useLatLong, setUseLatLong] = useState(false);

  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);

  const [resultList, setResultList] = useState([]);

  useEffect(() => {
    getSelectedTermList();
    getUserCurrentLatLong();
  }, []);

  const getSelectedTermList = () => {
    axios.get(
      `${ROOT_URL}/api/category/get-categories`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          console.log("response = ", response);
          if (!_.isEmpty(response.data.categories.categories)) {
            let foodList = [];
            let restaurantsList = [];
            let barsList = [];
            let breakfastBrunchList = [];
            response.data.categories.categories.forEach((item, i) => {
              if (!_.isEmpty(item.parent_aliases)) {
                const parentAliases = item.parent_aliases[0];
                if (_.isEqual(parentAliases, "food")) {
                  foodList.push(item);
                }
                if (_.isEqual(parentAliases, "restaurants")) {
                  restaurantsList.push(item);
                }
                if (_.isEqual(parentAliases, "bars")) {
                  barsList.push(item);
                }
                if (_.isEqual(parentAliases, "breakfast_brunch")) {
                  breakfastBrunchList.push(item);
                }
              }
            });

            let foodObj = {};
            let restaurantsObj = {};
            let barsObj = {};
            let breakfastBrunchObj = {};
            if (!_.isEmpty(foodList)) {
              let options = [];
              foodList.forEach((item, i) => {
                const optionsObj = {
                  value: item.alias,
                  label: item.title
                }
                options.push(optionsObj);
              });

              foodObj = {
                label: 'Food',
                options: options
              };
            }
            if (!_.isEmpty(restaurantsList)) {
              let options = [];
              restaurantsList.forEach((item, i) => {
                const optionsObj = {
                  value: item.alias,
                  label: item.title
                }
                options.push(optionsObj);
              });

              restaurantsObj = {
                label: 'Restaurants',
                options: options
              };
            }
            if (!_.isEmpty(barsList)) {
              let options = [];
              barsList.forEach((item, i) => {
                const optionsObj = {
                  value: item.alias,
                  label: item.title
                }
                options.push(optionsObj);
              });

              barsObj = {
                label: 'Bars',
                options: options
              };
            }
            if (!_.isEmpty(breakfastBrunchList)) {
              let options = [];
              breakfastBrunchList.forEach((item, i) => {
                const optionsObj = {
                  value: item.alias,
                  label: item.title
                }
                options.push(optionsObj);
              });

              breakfastBrunchObj = {
                label: 'Breakfast and Brunch',
                options: options
              }
            }
            let formattedSelectedTermList = [];
            formattedSelectedTermList.push(foodObj);
            formattedSelectedTermList.push(restaurantsObj);
            formattedSelectedTermList.push(barsObj);
            formattedSelectedTermList.push(breakfastBrunchObj);
            setSelectedTermList(formattedSelectedTermList);
          }
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          console.log("error = ", error);
          setOpenErrorAlert(true);
        }
      });
  }

  const getUserCurrentLatLong = () => {
    navigator.geolocation.getCurrentPosition((location) => {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      setLatitude(latitude);
      setLongitude(longitude);
    });
  }

  const findRestaurantsByLocation = (selectedTerm, location) => {
    axios.get(
      `${ROOT_URL}/api/restaurant/find-restaurants-by-location`,
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
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          console.log("response = ", response);
          setOpenSuccessAlert(true);
          setResultList(response.data.restaurants.businesses);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          console.log("error = ", error);
          setOpenErrorAlert(true);
        }
      });
  }

  const findRestaurantsByLatLong = (selectedTerm, latitude, longitude) => {
    axios.get(
      `${ROOT_URL}/api/restaurant/find-restaurants-by-lat-long`,
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
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          console.log("response = ", response);
          setOpenSuccessAlert(true);
          setResultList(response.data.restaurants.businesses);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          console.log("error = ", error);
          setOpenErrorAlert(true);
        }
      });
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

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const renderSelectDropdown = () => {
    let selectDropdown = null;

    if (_.isEqual(window.location.pathname, '/')) {
      selectDropdown = (
        <div>
          <Select
            placeholder="Select the food you want..."
            value={selectedTerm}
            onChange={handleChange}
            options={selectedTermList}
            isClearable={true}
            formatGroupLabel={formatGroupLabel}
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
          setOpenSuccessAlert(false);
          setOpenErrorAlert(false);
        }
      }

      if (useLatLong === true) {
        if (!_.isEmpty(latitude) && !_.isEmpty(longitude)) {
          findRestaurantsByLatLong(selectedTerm, latitude, longitude);
          setOpenSuccessAlert(false);
          setOpenErrorAlert(false);
        }
      }
    }
  }

  return (
    <div className="mt-5 d-flex justify-content-center">
      <Paper className={`${classes.root} mx-4`}>
        <div className="mt-2 mb-5 d-flex justify-content-center">
          <img src={logo} className="img-fluid" alt="logo" width="50%" />
        </div>
        {renderSelectDropdown()}
        {renderCheckbox()}
        {renderLocationInput()}
        {renderLatitudeAndLongitudeInput()}
        {renderSubmitButton()}
        <Snackbar openSuccessAlert={openSuccessAlert} openErrorAlert={openErrorAlert} />
      </Paper>
    </div>
  );
}

export default MainPage;
