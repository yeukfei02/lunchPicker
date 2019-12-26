import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router";
import _ from 'lodash';
import axios from 'axios';

import { getRootUrl, log } from '../../common/Common';

const ROOT_URL = getRootUrl();

function RestaurantDetails(props) {
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
      // const name = restaurantDetails.name;
      // const imageUrl = restaurantDetails.image_url;
      // const displayPhone = restaurantDetails.display_phone;
      // const location = restaurantDetails.location;
      // const coordinates = restaurantDetails.coordinates;
      // const photos = restaurantDetails.photos;
      // const hours = restaurantDetails.hours;

      resultDiv = (
        <div>
          restaurantDetails
        </div>
      );
    }

    return resultDiv;
  }

  return (
    <div className="mt-5 d-flex justify-content-center">
      {renderRestaurantDetails()}
    </div >
  )
}

export default withRouter(RestaurantDetails);
