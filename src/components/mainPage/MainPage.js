import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Select from 'react-select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import _ from 'lodash';
import axios from 'axios';

import logo from '../../images/logo.png';
import Snackbar from '../snackBar/SnackBar';
import DisplayResult from '../displayResult/DisplayResult';

const ROOT_URL = "https://lunch-picker-api.herokuapp.com/api";

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

  const [selectedTerm, setSelectedTerm] = useState('');
  const [radioButtonValue, setRadioButtonValue] = useState('');

  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [message, setMessage] = useState('');

  const [resultList, setResultList] = useState([]);

  useEffect(() => {
    getSelectedTermList();
    getUserCurrentLatLong();
  }, []);

  const getSelectedTermList = () => {
    axios.get(
      `${ROOT_URL}/category/get-categories`,
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
      `${ROOT_URL}/restaurant/find-restaurants-by-location`,
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
          setResultList(response.data.restaurants.businesses);
          setOpenSuccessAlert(true);
          setMessage('Retrieved data success!');
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          console.log("error = ", error);
          setOpenErrorAlert(true);
          setMessage('Location / Latitude Longitude is not valid!');
        }
      });
  }

  const findRestaurantsByLatLong = (selectedTerm, latitude, longitude) => {
    axios.get(
      `${ROOT_URL}/restaurant/find-restaurants-by-lat-long`,
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
          setResultList(response.data.restaurants.businesses);
          setOpenSuccessAlert(true);
          setMessage('Retrieved data success!');
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          console.log("error = ", error);
          setOpenErrorAlert(true);
          setMessage('Location / Latitude Longitude is not valid!');
        }
      });
  }

  const handleChange = (selectedTerm) => {
    setSelectedTerm(selectedTerm);
  };

  const handleRadioButtonChange = e => {
    setRadioButtonValue(e.target.value);
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

  const renderRadioButton = () => {
    let radioButtonDiv = null;

    if (!_.isEmpty(selectedTerm)) {
      radioButtonDiv = (
        <div>
          <RadioGroup aria-label="position" name="position" value={radioButtonValue} onChange={handleRadioButtonChange} row>
            <FormControlLabel
              value="places"
              control={<Radio color="primary" />}
              label="Places"
              labelPlacement="end"
            />
            <FormControlLabel
              value="useCurrentLocation"
              control={<Radio color="primary" />}
              label="Current Location"
              labelPlacement="end"
            />
          </RadioGroup>
        </div>
      );
    }

    return radioButtonDiv;
  }

  const renderLocationInput = () => {
    let locationInput = null;

    if (!_.isEmpty(selectedTerm) && _.isEqual(radioButtonValue, 'places')) {
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

    if (!_.isEmpty(selectedTerm) && _.isEqual(radioButtonValue, 'useCurrentLocation')) {
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
      if (_.isEqual(radioButtonValue, 'places')) {
        if (!_.isEmpty(location)) {
          submitButton = (
            <Button className="w-100" variant="outlined" color="secondary" onClick={handleSubmit}>
              Submit
            </Button>
          );
        }
      }

      if (_.isEqual(radioButtonValue, 'useCurrentLocation')) {
        submitButton = (
          <Button className="w-100" variant="outlined" color="secondary" onClick={handleSubmit}>
            Submit
          </Button>
        );
      }
    }

    return submitButton;
  }

  const renderClearButton = () => {
    const clearButton = (
      <Button className="w-100" variant="outlined" color="primary" onClick={handleClear}>
        Clear
      </Button>
    );

    return clearButton;
  }

  const handleSubmit = () => {
    if (!_.isEmpty(selectedTerm)) {
      if (_.isEqual(radioButtonValue, 'places')) {
        if (!_.isEmpty(location)) {
          findRestaurantsByLocation(selectedTerm, location);
          setOpenSuccessAlert(false);
          setOpenErrorAlert(false);
          setMessage('');
        }
      }

      if (_.isEqual(radioButtonValue, 'useCurrentLocation')) {
        if (latitude !== 0 && longitude !== 0) {
          findRestaurantsByLatLong(selectedTerm, latitude, longitude);
          setOpenSuccessAlert(false);
          setOpenErrorAlert(false);
          setMessage('');
        }
      }
    }
  }

  const handleClear = () => {
    setSelectedTerm('');
    setRadioButtonValue('');

    setOpenSuccessAlert(false);
    setOpenErrorAlert(false);
    setMessage('');

    setResultList([]);
  }

  const renderDisplayResult = () => {
    let displayResult = null;

    if (!_.isEmpty(resultList)) {
      displayResult = (
        <div>
          <DisplayResult resultList={resultList} />
        </div>
      );
    }

    return displayResult;
  }

  return (
    <div>
      <div className="mt-5 d-flex justify-content-center">
        <Paper className={`${classes.root} mx-4`}>
          <div className="mt-2 mb-5 d-flex justify-content-center">
            <img src={logo} className="img-fluid" alt="logo" width="50%" />
          </div>
          {renderSelectDropdown()}
          {renderRadioButton()}
          {renderLocationInput()}
          {renderLatitudeAndLongitudeInput()}
          {renderSubmitButton()}
          <div className="my-3"></div>
          {renderClearButton()}
          <Snackbar openSuccessAlert={openSuccessAlert} openErrorAlert={openErrorAlert} message={message} />
        </Paper>
      </div>
      {renderDisplayResult()}
    </div>
  );
}

export default MainPage;
