import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Select from 'react-select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Tooltip from '@material-ui/core/Tooltip';
import Bounce from 'react-reveal/Bounce';
import { red, grey } from '@material-ui/core/colors';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import axios from 'axios';

import FloatingActionButton from '../floatingActionButton/FloatingActionButton';
import Snackbar from '../snackBar/SnackBar';
import DisplayResult from '../displayResult/DisplayResult';
import { getRootUrl } from '../../common/Common';

const ROOT_URL = getRootUrl();

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
  },
  grey: {
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[500],
  },
}));

const selectStyles = {
  container: (base: any, state: any) => ({
    ...base,
    opacity: state.isDisabled ? '.5' : '1',
    backgroundColor: 'transparent',
    zIndex: '999',
  }),
};

function MainPage(): JSX.Element {
  const classes = useStyles();
  const { t } = useTranslation();

  const [selectedTermList, setSelectedTermList] = useState<any[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<any>(null);
  const [radioButtonValue, setRadioButtonValue] = useState<string>('');

  const [formattedRandomFoodList, setFormattedRandomFoodList] = useState<any[]>([]);
  const [randomFoodTerm, setRandomFoodTerm] = useState<any>([]);

  const [location, setLocation] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  const [openSuccessAlert, setOpenSuccessAlert] = useState<boolean>(false);
  const [openErrorAlert, setOpenErrorAlert] = useState<boolean>(false);
  const [message, setMessage] = useState('');

  const [submitButtonClicked, setSubmitButtonClicked] = useState<boolean>(false);
  const [randomButtonClicked, setRandomButtonClicked] = useState<boolean>(false);

  const [resultList, setResultList] = useState<any[]>([]);

  useEffect(() => {
    getSelectedTermList();
    getUserCurrentLatLong();
    setIntitialResultList();
  }, []);

  useEffect(() => {
    if (latitude !== 0 && longitude !== 0) findLocationTextByLatLong(latitude, longitude);
  }, [latitude, longitude]);

  useEffect(() => {
    if (!_.isEmpty(resultList)) {
      localStorage.setItem('resultList', JSON.stringify(resultList));
      setRandomButtonClicked(false);
    }
  }, [resultList]);

  const getSelectedTermList = async () => {
    const response = await axios.get(`${ROOT_URL}/category/get-categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      if (!_.isEmpty(response.data.categories)) {
        const foodList: any[] = [];
        const restaurantsList: any[] = [];
        const barsList: any[] = [];
        const breakfastBrunchList: any[] = [];
        response.data.categories.forEach((item: any, i: number) => {
          if (!_.isEmpty(item.parent_aliases)) {
            const parentAliases = item.parent_aliases[0];
            if (_.isEqual(parentAliases, 'food')) {
              foodList.push(item);
            }
            if (_.isEqual(parentAliases, 'restaurants')) {
              restaurantsList.push(item);
            }
            if (_.isEqual(parentAliases, 'bars')) {
              barsList.push(item);
            }
            if (_.isEqual(parentAliases, 'breakfast_brunch')) {
              breakfastBrunchList.push(item);
            }
          }
        });

        let foodObj: any = {};
        let restaurantsObj: any = {};
        let barsObj: any = {};
        let breakfastBrunchObj: any = {};
        if (!_.isEmpty(foodList)) {
          const options: any[] = [];
          foodList.forEach((item, i) => {
            const optionsObj = {
              value: item.alias,
              label: item.title,
            };
            options.push(optionsObj);
          });

          foodObj = {
            label: 'Food',
            options: options,
          };
        }
        if (!_.isEmpty(restaurantsList)) {
          const options: any[] = [];
          restaurantsList.forEach((item, i) => {
            const optionsObj = {
              value: item.alias,
              label: item.title,
            };
            options.push(optionsObj);
          });

          restaurantsObj = {
            label: 'Restaurants',
            options: options,
          };
        }
        if (!_.isEmpty(barsList)) {
          const options: any[] = [];
          barsList.forEach((item, i) => {
            const optionsObj = {
              value: item.alias,
              label: item.title,
            };
            options.push(optionsObj);
          });

          barsObj = {
            label: 'Bars',
            options: options,
          };
        }
        if (!_.isEmpty(breakfastBrunchList)) {
          const options: any[] = [];
          breakfastBrunchList.forEach((item, i) => {
            const optionsObj = {
              value: item.alias,
              label: item.title,
            };
            options.push(optionsObj);
          });

          breakfastBrunchObj = {
            label: 'Breakfast and Brunch',
            options: options,
          };
        }
        const formattedSelectedTermList: any[] = [];
        formattedSelectedTermList.push(foodObj);
        formattedSelectedTermList.push(restaurantsObj);
        formattedSelectedTermList.push(barsObj);
        formattedSelectedTermList.push(breakfastBrunchObj);
        setSelectedTermList(formattedSelectedTermList);
      }
    } else {
      setOpenErrorAlert(true);
      setMessage('Get categories error!');
    }
  };

  const getUserCurrentLatLong = () => {
    navigator.geolocation.getCurrentPosition((location: any) => {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      console.log('latitude = ', latitude);
      console.log('longitude = ', longitude);
      setLatitude(latitude);
      setLongitude(longitude);
    });
  };

  const setIntitialResultList = () => {
    const resultListFromLocalStorageStr = localStorage.getItem('resultList');
    if (resultListFromLocalStorageStr) {
      const resultListFromLocalStorageJSON = JSON.parse(resultListFromLocalStorageStr);
      setResultList(resultListFromLocalStorageJSON);
    }
  };

  const findLocationTextByLatLong = async (latitude: number, longitude: number) => {
    const response = await axios.get(`${ROOT_URL}/restaurant/find-location-text-by-lat-long`, {
      params: {
        latitude: latitude,
        longitude: longitude,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      setLocation(response.data.location.display_name);
    } else {
      setOpenErrorAlert(true);
      setMessage('Find location text by lat long error!');
    }
  };

  const findRestaurantsByLocation = async (selectedTerm: string, location: any) => {
    const response = await axios.get(`${ROOT_URL}/restaurant/find-restaurants-by-location`, {
      params: {
        term: selectedTerm,
        location: location,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      setResultList(response.data.restaurants.businesses);
      setOpenSuccessAlert(true);
      setMessage('Retrieved data success! Please scroll down');
      setSubmitButtonClicked(false);
      setRandomButtonClicked(false);
    } else {
      setOpenErrorAlert(true);
      setMessage('Location / Latitude Longitude is not valid!');
      setSubmitButtonClicked(false);
      setRandomButtonClicked(false);
    }
  };

  const findRestaurantsByLatLong = async (selectedTerm: string, latitude: number, longitude: number) => {
    const response = await axios.get(`${ROOT_URL}/restaurant/find-restaurants-by-lat-long`, {
      params: {
        term: selectedTerm,
        latitude: latitude,
        longitude: longitude,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      setResultList(response.data.restaurants.businesses);
      setOpenSuccessAlert(true);
      setMessage('Retrieved data success! Please scroll down');
      setSubmitButtonClicked(false);
      setRandomButtonClicked(false);
    } else {
      setOpenErrorAlert(true);
      setMessage('Location / Latitude Longitude is not valid!');
      setSubmitButtonClicked(false);
      setRandomButtonClicked(false);
    }
  };

  const handleChange = (selectedTerm: any) => {
    setSelectedTerm(selectedTerm);
  };

  const handleRadioButtonChange = (e: any) => {
    setRadioButtonValue(e.target.value);
  };

  const handleLocationChange = (e: any) => {
    setLocation(e.target.value);
  };

  // const handleLatitudeChange = (e) => {
  //   setLatitude(e.target.value);
  // }
  //
  // const handleLongitudeChange = (e) => {
  //   setLongitude(e.target.value);
  // }

  const formatGroupLabel = (data: any) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span
        style={{
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
        }}
      >
        {data.options.length}
      </span>
    </div>
  );

  const renderSelectDropdown = () => {
    let selectDropdown: any = null;

    if (_.isEqual(window.location.pathname, '/')) {
      selectDropdown = (
        <div>
          <Select
            styles={selectStyles}
            placeholder={t('selectTheFoodYouWant')}
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
  };

  const renderRadioButton = () => {
    const radioButtonDiv = (
      <div>
        <RadioGroup
          aria-label="position"
          name="position"
          value={radioButtonValue}
          onChange={e => handleRadioButtonChange(e)}
          row
        >
          <FormControlLabel
            value="places"
            control={<Radio color="primary" />}
            label={t('places')}
            labelPlacement="end"
          />
          {latitude !== 0 && longitude !== 0 ? (
            <FormControlLabel
              value="useCurrentLocation"
              control={<Radio color="primary" />}
              label={t('currentLocation')}
              labelPlacement="end"
            />
          ) : (
            <FormControlLabel
              value="useCurrentLocation"
              control={<Radio color="primary" />}
              label={t('currentLocationWaitForBrowserDetection')}
              labelPlacement="end"
              disabled={true}
            />
          )}
        </RadioGroup>
      </div>
    );

    return radioButtonDiv;
  };

  const renderLocationInput = () => {
    let locationInput: any = null;

    if (_.isEqual(radioButtonValue, 'places')) {
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
            value={location}
            onChange={e => handleLocationChange(e)}
          />
          <div className="my-3"></div>
        </div>
      );
    }

    return locationInput;
  };

  // const renderLatitudeAndLongitudeInput = () => {
  //   let latitudeAndLongitudeInput: any = null;
  //
  //   if (_.isEqual(radioButtonValue, 'useCurrentLocation')) {
  //     latitudeAndLongitudeInput = (
  //       <div>
  //         <TextField
  //           id="outlined-full-width"
  //           label="Latitude"
  //           placeholder="Enter latitude..."
  //           type="number"
  //           helperText="your current latitude"
  //           fullWidth
  //           margin="normal"
  //           variant="outlined"
  //           InputLabelProps={{
  //             shrink: true,
  //           }}
  //           value={latitude}
  //           onChange={handleLatitudeChange}
  //         />
  //         <TextField
  //           id="outlined-full-width"
  //           label="Longitude"
  //           placeholder="Enter longitude..."
  //           type="number"
  //           helperText="your current longitude"
  //           fullWidth
  //           margin="normal"
  //           variant="outlined"
  //           InputLabelProps={{
  //             shrink: true,
  //           }}
  //           value={longitude}
  //           onChange={handleLongitudeChange}
  //         />
  //         <div className="my-3"></div>
  //       </div>
  //     );
  //   }
  //
  //   return latitudeAndLongitudeInput;
  // }

  const renderAvailableCountry = () => {
    const availableCountry = [
      'Argentina',
      'Australia',
      'Austria',
      'Belgium',
      'Brazil',
      'Canada',
      'Chile',
      'Czech Republic',
      'Denmark',
      'Finland',
      'France',
      'Germany',
      'Hong Kong',
      'Italy',
      'Japan',
      'Malaysia',
      'Mexico',
      'New Zealand',
      'Norway',
      'Philippines',
      'Poland',
      'Portugal',
      'Republic of Ireland',
      'Singapore',
      'Spain',
      'Sweden',
      'Switzerland',
      'Taiwan',
      'The Netherlands',
      'Turkey',
      'United Kingdom',
      'United States',
    ];

    const availableCountryText = `Available country: ${availableCountry.join(', ')}`;

    return (
      <Tooltip title={availableCountryText}>
        <HelpOutlineIcon style={{ color: red[500], cursor: 'pointer' }} />
      </Tooltip>
    );
  };

  const renderSubmitButton = () => {
    let submitButton: any = null;

    if (_.isEqual(radioButtonValue, 'places')) {
      if (!_.isEmpty(location)) {
        if (submitButtonClicked) {
          submitButton = (
            <Button className="w-100" variant="outlined" color="secondary" disabled={true} onClick={handleSubmit}>
              {t('loading...')}
            </Button>
          );
        } else {
          submitButton = (
            <Button className="w-100" variant="outlined" color="secondary" onClick={handleSubmit}>
              {t('submit')}
            </Button>
          );
        }
      }
    }

    if (_.isEqual(radioButtonValue, 'useCurrentLocation')) {
      if (submitButtonClicked) {
        submitButton = (
          <Button className="w-100" variant="outlined" color="secondary" disabled={true} onClick={handleSubmit}>
            {t('loading...')}
          </Button>
        );
      } else {
        submitButton = (
          <Button className="w-100" variant="outlined" color="secondary" onClick={handleSubmit}>
            {t('submit')}
          </Button>
        );
      }
    }

    return submitButton;
  };

  const renderClearButton = () => {
    const clearButton = (
      <Button className="w-100" variant="outlined" color="primary" onClick={handleClear}>
        {t('clear')}
      </Button>
    );

    return clearButton;
  };

  const renderRandomButton = () => {
    let randomButton: any = null;

    if (randomButtonClicked) {
      randomButton = (
        <Bounce>
          <Tooltip title="Let's eat" placement="bottom">
            <Avatar
              alt=""
              className={`${classes.grey}`}
              style={{ padding: '1.8em', margin: '0 auto', cursor: 'pointer' }}
            >
              <FastfoodIcon style={{ color: '#fff', fontSize: 34 }} />
            </Avatar>
          </Tooltip>
        </Bounce>
      );
    } else {
      randomButton = (
        <Tooltip title="Let's eat" placement="bottom">
          <Avatar
            alt=""
            className={`${classes.red}`}
            style={{ padding: '1.8em', margin: '0 auto', cursor: 'pointer' }}
            onClick={handleRandom}
          >
            <FastfoodIcon style={{ color: '#fff', fontSize: 34 }} />
          </Avatar>
        </Tooltip>
      );
    }

    return randomButton;
  };

  const renderSortedByButton = () => {
    let sortedByButton: any = null;

    if (!_.isEmpty(resultList)) {
      sortedByButton = (
        <div>
          <Button className="w-100" variant="outlined" color="primary" onClick={handleSortedByRating}>
            {t('sortedByRating')}
          </Button>
          <div className="my-3"></div>
          <Button className="w-100" variant="outlined" color="primary" onClick={handleSortedByDistance}>
            {t('sortedByDistance')}
          </Button>
        </div>
      );
    }

    return sortedByButton;
  };

  const renderRandomFoodCategory = () => {
    let randomFoodCategory: any = null;

    if (!_.isEmpty(randomFoodTerm)) {
      randomFoodCategory = (
        <div className="my-3 d-flex justify-content-center">
          <h6>
            {t('randomFoodCategory')} {randomFoodTerm}
          </h6>
        </div>
      );
    }

    return randomFoodCategory;
  };

  const handleSubmit = () => {
    setRandomFoodTerm('');
    setResultList([]);
    localStorage.setItem('resultList', '');
    setSubmitButtonClicked(true);

    if (_.isEqual(radioButtonValue, 'places')) {
      if (!_.isEmpty(location)) {
        const term = !_.isEmpty(selectedTerm) ? selectedTerm.label : '';
        findRestaurantsByLocation(term, location);
        setOpenSuccessAlert(false);
        setOpenErrorAlert(false);
        setMessage('');
      }
    }

    if (_.isEqual(radioButtonValue, 'useCurrentLocation')) {
      if (latitude !== 0 && longitude !== 0) {
        const term = !_.isEmpty(selectedTerm) ? selectedTerm.label : '';
        findRestaurantsByLatLong(term, latitude, longitude);
        setOpenSuccessAlert(false);
        setOpenErrorAlert(false);
        setMessage('');
      }
    }
  };

  const handleClear = () => {
    setSelectedTerm('');
    setRadioButtonValue('');

    setOpenSuccessAlert(false);
    setOpenErrorAlert(false);
    setMessage('');

    setRandomFoodTerm('');
    setResultList([]);
    localStorage.setItem('resultList', '');
  };

  const handleRandom = async () => {
    setResultList([]);
    localStorage.setItem('resultList', '');
    setRandomButtonClicked(true);

    if (_.isEmpty(formattedRandomFoodList)) {
      const response = await axios.get(`${ROOT_URL}/category/get-categories`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!_.isEmpty(response)) {
        console.log('response = ', response);
        if (!_.isEmpty(response.data.categories)) {
          const randomFoodList: any[] = [];
          response.data.categories.forEach((item: any, i: number) => {
            if (!_.isEmpty(item.parent_aliases)) {
              const parentAliases = item.parent_aliases[0];
              if (
                _.isEqual(parentAliases, 'food') ||
                _.isEqual(parentAliases, 'restaurants') ||
                _.isEqual(parentAliases, 'bars') ||
                _.isEqual(parentAliases, 'breakfast_brunch')
              ) {
                randomFoodList.push(item);
              }
            }
          });
          const formattedRandomFoodList = randomFoodList.map((item, i) => {
            return item.title;
          });
          setFormattedRandomFoodList(formattedRandomFoodList);

          getRandomResult(formattedRandomFoodList);
        }
      } else {
        setOpenErrorAlert(true);
        setMessage('Get categories error!');
      }
    } else {
      getRandomResult(formattedRandomFoodList);
    }
  };

  const handleSortedByRating = () => {
    const sortedByRatingResultList = _.orderBy(resultList, ['rating'], ['desc']);
    setResultList(sortedByRatingResultList);
  };

  const handleSortedByDistance = () => {
    const sortedByDistanceResultList = _.orderBy(resultList, ['distance'], ['asc']);
    setResultList(sortedByDistanceResultList);
  };

  const getRandomResult = (formattedRandomFoodList: any[]) => {
    const selectedTerm = _.sample(formattedRandomFoodList);
    setRandomFoodTerm(selectedTerm);
    if (!_.isEmpty(selectedTerm) && latitude !== 0 && longitude !== 0) {
      findRestaurantsByLatLong(selectedTerm, latitude, longitude);
      setOpenSuccessAlert(false);
      setMessage('');
    }
  };

  const renderDisplayResult = () => {
    let displayResult: any = null;

    if (!_.isEmpty(resultList)) {
      displayResult = (
        <div>
          <DisplayResult resultList={resultList} />
        </div>
      );
    }

    return displayResult;
  };

  return (
    <div>
      <div className="mt-5 mb-3 d-flex justify-content-center">
        <Paper className={`${classes.root} mx-4`}>
          <div className="mb-4 d-flex justify-content-end">{renderAvailableCountry()}</div>
          <div className="mt-2 mb-4 d-flex justify-content-center">
            <img src={require('../../images/logo2.png')} className="img-fluid" alt="logo" width="100%" />
          </div>
          {renderSelectDropdown()}
          {renderRadioButton()}
          {renderLocationInput()}
          {/*renderLatitudeAndLongitudeInput()*/}
          {renderSubmitButton()}
          <div className="my-3"></div>
          {renderClearButton()}
          <div className="my-3"></div>
          {renderRandomButton()}
          <div className="my-3"></div>
          {renderRandomFoodCategory()}
          <div className="my-3"></div>
          {renderSortedByButton()}
          <FloatingActionButton />
          <Snackbar openSuccessAlert={openSuccessAlert} openErrorAlert={openErrorAlert} message={message} />
        </Paper>
      </div>
      {renderDisplayResult()}
    </div>
  );
}

export default MainPage;
