import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import _ from 'lodash';
import axios from 'axios';

import { getRootUrl, log } from '../../common/Common';

const ROOT_URL = getRootUrl();

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    display: 'flex',
    flexWrap: 'wrap',
  },
}));

function RestaurantDetails(props) {
  const classes = useStyles();
  const [restaurantDetails, setRestaurantDetails] = useState();

  useEffect(() => {
    const id = props.match.params.id;
    if (!_.isEmpty(id))
      getRestaurantsDetailsById(id);
  }, [props.match.params.id]);

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
      const name = restaurantDetails.name;
      const imageUrl = restaurantDetails.image_url;
      const url = restaurantDetails.url;
      const displayPhone = restaurantDetails.display_phone;
      const categories = restaurantDetails.categories;
      const location = restaurantDetails.location;
      const coordinates = restaurantDetails.coordinates;
      const photos = restaurantDetails.photos;

      let locationStr = '';
      if (!_.isEmpty(location)) {
        if (!_.isEmpty(location.display_address)) {
          locationStr = location.display_address.join(', ');
        }
      }

      let carouselDiv = [];
      if (!_.isEmpty(photos)) {
        photos.forEach((item, i) => {
          carouselDiv.push(
            <div>
              {item}
            </div>
          )
        });
      }

      resultDiv = (
        <div>
          <h5>Restaurant details</h5>
          <div className="text-center">
            <img src={imageUrl} className="rounded" alt="imageUrl" width="200" height="200" />
          </div>
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
      );
    }

    return resultDiv;
  }

  const renderOpenHours = () => {
    let resultDiv = null;

    if (!_.isEmpty(restaurantDetails)) {
      const hours = restaurantDetails.hours;

      let openList = [];
      let hoursType = '';
      let isOpenNow = '';
      if (!_.isEmpty(hours)) {
        hours.forEach((item, i) => {
          const open = item.open;
          if (!_.isEmpty(open)) {
            open.forEach((value, i) => {
              let obj = {};
              obj.is_overnight = value.is_overnight;
              obj.start = value.start;
              obj.end = value.end;
              obj.day = value.day;
              openList.push(obj);
            })
          }

          hoursType = item.hours_type;
          isOpenNow = item.is_open_now;
        });
      }

      let openListDiv = null;
      if (!_.isEmpty(openList)) {
        openListDiv = openList.map((item, i) => {
          return (
            <div key={i}>
              Day: {item.day}
              Start: {item.start}
              End: {item.end}
              Is overnight: {item.is_overnight}
            </div>
          );
        });
      }

      resultDiv = (
        <div>
          <TextField
            label="Open"
            placeholder="Open"
            value={openListDiv}
            fullWidth
            multiline
            rows="10"
            margin="normal"
            InputLabelProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
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
          <TextField
            label="Is open now"
            placeholder="Is open now"
            value={isOpenNow.toString()}
            fullWidth
            margin="normal"
            InputLabelProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </div>
      );
    }

    return resultDiv;
  }

  return (
    <div>
      <div className="mt-5 d-flex justify-content-center">
        <Paper className={`${classes.root} mx-4 w-75 d-flex justify-content-center`}>
          {renderRestaurantDetails()}
        </Paper>
      </div>
      <div className="mt-5 d-flex justify-content-center">
        <Paper className={`${classes.root} mx-4 w-75 d-flex justify-content-center`}>
          {renderOpenHours()}
        </Paper>
      </div>
    </div>
  )
}

export default withRouter(RestaurantDetails);
