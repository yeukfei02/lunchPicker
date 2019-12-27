import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router";
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
  table: {
    minWidth: 650,
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
      // const coordinates = restaurantDetails.coordinates;
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
        <div className="my-5 d-flex justify-content-center">
          <Paper className={`${classes.root} mx-4 w-75 d-flex justify-content-center`}>
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
          </Paper>
        </div>
      );
    }

    return resultDiv;
  }

  const renderOpenHours = () => {
    let resultDiv = null;

    if (!_.isEmpty(restaurantDetails)) {
      const hours = restaurantDetails.hours;
      if (!_.isEmpty(hours)) {
        let rows = [];
        let hoursType = '';
        let isOpenNow = '';
        if (!_.isEmpty(hours)) {
          hours.forEach((item, i) => {
            const open = item.open;
            if (!_.isEmpty(open)) {
              open.forEach((value, i) => {
                let obj = {};
                switch (value.day) {
                  case 0:
                    obj.day = "Mon";
                    break;
                  case 1:
                    obj.day = "Tue";
                    break;
                  case 2:
                    obj.day = "Wed";
                    break;
                  case 3:
                    obj.day = "Thu";
                    break;
                  case 4:
                    obj.day = "Fri";
                    break;
                  case 5:
                    obj.day = "Sat";
                    break;
                  case 6:
                    obj.day = "Sun";
                    break;
                  default:

                }
                obj.start = `${value.start.substring(0, 2)}:${value.start.substring(2)}`;
                obj.end = `${value.end.substring(0, 2)}:${value.end.substring(2)}`;
                obj.is_overnight = value.is_overnight;
                rows.push(obj);
              })
            }

            hoursType = item.hours_type;
            isOpenNow = item.is_open_now;
          });
        }

        resultDiv = (
          <div className="my-5 d-flex justify-content-center">
            <Paper className={`${classes.root} mx-4 w-75 d-flex justify-content-center`}>
              <div>
                <TableContainer component={Paper} className="mb-3">
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Opening time</TableCell>
                        <TableCell align="right">Start</TableCell>
                        <TableCell align="right">End</TableCell>
                        <TableCell align="right">Is overnight</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell component="th" scope="row">
                            {row.day}
                          </TableCell>
                          <TableCell align="right">{row.start}</TableCell>
                          <TableCell align="right">{row.end}</TableCell>
                          <TableCell align="right">
                            <Checkbox
                              checked={row.is_overnight ? true : false}
                              disabled={true}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
                        disabled={true}
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
    }

    return resultDiv;
  }

  return (
    <div>
      {renderRestaurantDetails()}
      {renderOpenHours()}
    </div>
  )
}

export default withRouter(RestaurantDetails);
