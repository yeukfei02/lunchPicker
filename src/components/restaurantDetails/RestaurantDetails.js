import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router";
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import axios from 'axios';

import ReactTable from '../reactTable/ReactTable';
import ImageSlider from '../imageSlider/ImageSlider';
import CustomMap from '../customMap/CustomMap';
import Snackbar from '../snackBar/SnackBar';

import { getRootUrl, log } from '../../common/Common';

const ROOT_URL = getRootUrl();

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function RestaurantDetails(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [photosList, setPhotosList] = useState([]);
  const [name, setName] = useState('');
  const [locationStr, setLocationStr] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const id = props.match.params.id;
    if (!_.isEmpty(id))
      getRestaurantsDetailsById(id);
  }, [props.match.params.id]);

  useEffect(() => {
    if (openSuccessAlert === true) {
      setOpenSuccessAlert(false);
    }
    if (!_.isEmpty(message)) {
      setMessage('');
    }
  }, [openSuccessAlert, message]);

  const getRestaurantsDetailsById = (id) => {
    axios.get(
      `${ROOT_URL}/restaurant/get-restaurant-details/${id}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
          setRestaurantDetails(response.data.restaurantDetails);

          const name = response.data.restaurantDetails.name;
          setName(name);

          const photos = response.data.restaurantDetails.photos;
          setPhotosList(photos);

          const location = response.data.restaurantDetails.location;
          let locationStr = '';
          if (!_.isEmpty(location)) {
            if (!_.isEmpty(location.display_address)) {
              locationStr = location.display_address.join(', ');
            }
          }
          setLocationStr(locationStr);

          const coordinates = response.data.restaurantDetails.coordinates;
          const latitude = coordinates.latitude;
          const longitude = coordinates.longitude;
          setLatitude(latitude);
          setLongitude(longitude);

          setOpenSuccessAlert(true);
          setMessage('Retrieve restaurant details success!');
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
        }
      });
  }

  const renderRestaurantDetails = () => {
    let resultDiv = null;

    if (!_.isEmpty(restaurantDetails)) {
      const url = restaurantDetails.url;
      const displayPhone = restaurantDetails.display_phone;
      const categories = restaurantDetails.categories;

      resultDiv = (
        <div className="my-5 d-flex justify-content-center">
          <Paper className={`${classes.root} mx-4 w-75 d-flex justify-content-center`}>
            <div>
              <h5 className="mb-3">{t('restaurantDetails')}</h5>
              <ImageSlider photosList={photosList} />
              <TextField
                label="Name"
                placeholder="Name"
                value={name}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
              <TextField
                label="Phone"
                placeholder="Phone"
                value={displayPhone}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
              <TextField
                label="Url"
                placeholder="Url"
                value={url}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
              {
                categories.forEach((item, i) => {
                  return (
                    <div key={i}>
                      <TextField
                        label="Category"
                        placeholder="Category"
                        value={item.title}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                      />
                    </div>
                  );
                })
              }
              <TextField
                label="Location"
                placeholder="Location"
                value={locationStr}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </div>
          </Paper>
        </div>
      );
    }

    return resultDiv;
  }

  const renderCustomMap = () => {
    let resultDiv = null;

    if (latitude !== 0 && longitude !== 0) {
      resultDiv = (
        <div className="my-5 d-flex justify-content-center">
          <Paper className={`${classes.root} mx-4 w-75 d-flex justify-content-center`}>
            <CustomMap latitude={latitude} longitude={longitude} name={name} address={locationStr} />
          </Paper>
        </div>
      );
    }

    return resultDiv;
  }

  const renderOpeningTimeTable = () => {
    let resultDiv = null;

    if (!_.isEmpty(restaurantDetails)) {
      const hours = restaurantDetails.hours;
      if (!_.isEmpty(hours)) {
        let data = [];
        let hoursType = '';
        let isOpenNow = '';

        hours.forEach((item, i) => {
          const open = item.open;
          if (!_.isEmpty(open)) {
            data = open.map((item, i) => {
              switch (item.day) {
                case 0:
                  item.day = "Mon";
                  break;
                case 1:
                  item.day = "Tue";
                  break;
                case 2:
                  item.day = "Wed";
                  break;
                case 3:
                  item.day = "Thu";
                  break;
                case 4:
                  item.day = "Fri";
                  break;
                case 5:
                  item.day = "Sat";
                  break;
                case 6:
                  item.day = "Sun";
                  break;
                default:

              }
              if (!item.start.includes(':')) {
                item.start = `${item.start.substring(0, 2)}:${item.start.substring(2)}`;
              }
              if (!item.end.includes(':')) {
                item.end = `${item.end.substring(0, 2)}:${item.end.substring(2)}`;
              }
              return item;
            });
          }

          hoursType = item.hours_type;
          isOpenNow = item.is_open_now;
        });

        const column = [
          {
            Header: "Day",
            accessor: "day",
          },
          {
            Header: "Start",
            accessor: "start",
          },
          {
            Header: "End",
            accessor: "end",
          },
          {
            Header: "Is overnight",
            accessor: (data) => {
              return (
                <Checkbox
                  checked={data.is_overnight ? true : false}
                />
              );
            },
          },
        ];

        resultDiv = (
          <div className="my-5 d-flex justify-content-center">
            <Paper className={`${classes.root} mx-4 w-75 d-flex justify-content-center`}>
              <div>
                <ReactTable column={column} data={data} />
                <TextField
                  label="Hours type"
                  placeholder="Hours type"
                  value={hoursType.toLowerCase()}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isOpenNow ? true : false}
                      />
                    }
                    label="Is open now"
                  />
                </FormGroup>
              </div>
            </Paper>
          </div>
        );
      }

      return resultDiv;
    }
  }

  return (
    <div>
      {renderRestaurantDetails()}
      {renderCustomMap()}
      {renderOpeningTimeTable()}
      <Snackbar openSuccessAlert={openSuccessAlert} message={message} />
    </div>
  )
}

export default withRouter(RestaurantDetails);
