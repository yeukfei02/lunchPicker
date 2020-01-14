import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { useTranslation } from 'react-i18next';
import Fade from 'react-reveal/Fade';
import _ from 'lodash';
import axios from 'axios';

import CardView from '../cardView/CardView';
import FloatingActionButton from '../floatingActionButton/FloatingActionButton';
import Snackbar from '../snackBar/SnackBar';
import { getRootUrl, log } from '../../common/Common';

const ROOT_URL = getRootUrl();

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    flexGrow: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: red[500],
  },
}));

function RandomFood() {
  const classes = useStyles();
  const { t } = useTranslation();

  const [useRandomFoodCategory, setUseRandomFoodCategory] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('');

  const [randomFoodList, setRandomFoodList] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [message, setMessage] = useState('');

  const [open, setOpen] = useState(true);

  const [refreshButtonClicked, setRefreshButtonClicked] = useState(false);

  const [resultList, setResultList] = useState([]);

  useEffect(() => {
    getRandomFoodList();
    getUserCurrentLatLong();
  }, []);

  useEffect(() => {
    if (!_.isEmpty(randomFoodList)) {
      setTimeout(() => {
        setOpen(false)
      }, 1000);
    }
  }, [randomFoodList]);

  useEffect(() => {
    const selectedTerm = _.sample(randomFoodList);
    setSelectedTerm(selectedTerm);
    if (latitude !== 0 && longitude !== 0)
      findRestaurantsByLatLong(useRandomFoodCategory, selectedTerm, latitude, longitude);
  }, [useRandomFoodCategory, randomFoodList, latitude, longitude]);

  useEffect(() => {
    if (openSuccessAlert === true) {
      setOpenSuccessAlert(false);
    }
    if (!_.isEmpty(message)) {
      setMessage('');
    }
  }, [openSuccessAlert, message]);

  const getRandomFoodList = () => {
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
          log("response = ", response);
          if (!_.isEmpty(response.data.categories)) {
            let randomFoodList = [];
            response.data.categories.forEach((item, i) => {
              if (!_.isEmpty(item.parent_aliases)) {
                const parentAliases = item.parent_aliases[0];
                if (_.isEqual(parentAliases, "food") || _.isEqual(parentAliases, "restaurants") || _.isEqual(parentAliases, "bars") || _.isEqual(parentAliases, "breakfast_brunch")) {
                  randomFoodList.push(item);
                }
              }
            });
            const formattedRandomFoodList = randomFoodList.map((item, i) => {
              return item.title;
            });
            setRandomFoodList(formattedRandomFoodList);
          }
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
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

  const findRestaurantsByLatLong = (useRandomFoodCategory, selectedTerm, latitude, longitude) => {
    axios.get(
      `${ROOT_URL}/restaurant/find-restaurants-by-lat-long`,
      {
        params: {
          term: useRandomFoodCategory === true ? selectedTerm : '',
          latitude: latitude,
          longitude: longitude
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
          setResultList(response.data.restaurants.businesses);
          setRefreshButtonClicked(false);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
          setRefreshButtonClicked(false);
        }
      });
  }

  const renderRefreshButton = () => {
    let refreshButton = null;

    if (refreshButtonClicked === true) {
      refreshButton = (
        <div className="d-flex justify-content-end" style={{ marginRight: '2.5em' }}>
          <Button variant="contained" color="primary" disabled={true} onClick={handleRefresh}>
            {t('loading')}
          </Button>
        </div>
      );
    } else {
      refreshButton = (
        <div className="d-flex justify-content-end" style={{ marginRight: '2.5em' }}>
          <Button variant="contained" color="primary" onClick={handleRefresh}>
            {t('refresh')}
          </Button>
        </div>
      );
    }

    return refreshButton;
  }

  const renderRandomFood = () => {
    let cardViewResultList = null;

    if (!_.isEmpty(resultList)) {
      cardViewResultList = resultList.map((item, i) => {
        return (
          <Grid key={i} item xs={12} sm={4}>
            <Fade bottom>
              <div className="d-flex justify-content-center">
                <CardView resultListItem={item} />
              </div>
            </Fade>
          </Grid>
        );
      });
    }

    return cardViewResultList;
  }

  const renderDiv = () => {
    let renderDiv = null;

    if (!_.isEmpty(resultList)) {
      renderDiv = (
        <div className={classes.root} style={{ overflow: 'hidden' }}>
          <Grid container spacing={3}>
            {renderRandomFood()}
          </Grid>
        </div>
      );
    } else {
      renderDiv = (
        <div>
          <Backdrop
            className={classes.backdrop}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className="mt-4 d-flex justify-content-center">
            <Paper className={`${classes.root} mx-4 w-75 text-center`}>
              <h4>{t('thereAreNoResult')}</h4>
            </Paper>
          </div>
        </div>
      );
    }

    return renderDiv;
  }

  const handleRefresh = () => {
    setResultList([]);
    setRefreshButtonClicked(true);

    const selectedTerm = _.sample(randomFoodList);
    setSelectedTerm(selectedTerm);
    if (latitude !== 0 && longitude !== 0) {
      findRestaurantsByLatLong(useRandomFoodCategory, selectedTerm, latitude, longitude);
      setOpenSuccessAlert(true);
      setMessage('Refresh success!');
    }
  }

  const handleSortedByRating = () => {
    const sortedByRatingResultList = _.orderBy(resultList, ['rating'], ['desc']);
    setResultList(sortedByRatingResultList);
  }

  const handleSortedByDistance = () => {
    const sortedByDistanceResultList = _.orderBy(resultList, ['distance'], ['asc']);
    setResultList(sortedByDistanceResultList);
  }

  const handleSwitchChange = (e) => {
    setUseRandomFoodCategory(e.target.checked);
    setOpenSuccessAlert(true);
    setMessage('Refresh success!');
  }

  return (
    <div>
      <div className="mt-4 d-flex justify-content-end" style={{ marginRight: '2.5em' }}>
        <Typography component={'span'}>
          {
            useRandomFoodCategory === true && !_.isEmpty(selectedTerm) ?
              <div>
                <b>{t('currentFoodCategory')}</b> {selectedTerm}
              </div>
              :
              null
          }
        </Typography>
      </div>
      <div className="mt-2 d-flex justify-content-end" style={{ marginRight: '1.5em' }}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch checked={useRandomFoodCategory} color="primary" onChange={(e) => handleSwitchChange(e)} value="useRandomFoodCategory" />
            }
            label={t('useRandomFoodCategory')}
          />
        </FormGroup>
      </div>
      {renderRefreshButton()}
      <div className="mt-3 d-flex justify-content-end" style={{ marginRight: '2.5em' }}>
        <Button variant="outlined" color="primary" onClick={handleSortedByRating}>
          {t('sortedByRating')}
        </Button>
      </div>
      <div className="mt-3 d-flex justify-content-end" style={{ marginRight: '2.5em' }}>
        <Button variant="outlined" color="primary" onClick={handleSortedByDistance}>
          {t('sortedByDistance')}
        </Button>
      </div>
      {renderDiv()}
      <FloatingActionButton />
      <Snackbar openSuccessAlert={openSuccessAlert} message={message} />
    </div>
  )
}

export default RandomFood;
