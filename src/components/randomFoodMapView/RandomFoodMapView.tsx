import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import axios from 'axios';

import CustomMapList from '../customMap/CustomMapList';
import Snackbar from '../snackBar/SnackBar';
import { getRootUrl, log } from '../../common/Common';

const ROOT_URL = getRootUrl();

function RandomFoodMapView(): JSX.Element {
  const { t } = useTranslation();

  const [selectedTerm, setSelectedTerm] = useState<any>('');

  const [randomFoodList, setRandomFoodList] = useState<any[]>([]);
  const [nameList, setNameList] = useState<any[]>([]);
  const [locationStrList, setLocationStrList] = useState<any[]>([]);
  const [coordinatesList, setCoordinatesList] = useState<any[]>([]);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  const [openSuccessAlert, setOpenSuccessAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [refreshButtonClicked, setRefreshButtonClicked] = useState<boolean>(false);

  useEffect(() => {
    getRandomFoodList();
    getUserCurrentLatLong();
  }, []);

  useEffect(() => {
    const selectedTerm = _.sample(randomFoodList);
    setSelectedTerm(selectedTerm);
    if (!_.isEmpty(selectedTerm) && latitude !== 0 && longitude !== 0)
      findRestaurantsByLatLong(selectedTerm, latitude, longitude);
  }, [randomFoodList, latitude, longitude]);

  useEffect(() => {
    if (openSuccessAlert === true) {
      setOpenSuccessAlert(false);
    }
    if (!_.isEmpty(message)) {
      setMessage('');
    }
  }, [openSuccessAlert, message]);

  const getRandomFoodList = async () => {
    const response = await axios.get(`${ROOT_URL}/category/get-categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      log('response = ', response);
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
        setRandomFoodList(formattedRandomFoodList);
      }
    }
  };

  const getUserCurrentLatLong = () => {
    navigator.geolocation.getCurrentPosition((location: any) => {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      setLatitude(latitude);
      setLongitude(longitude);
    });
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
      log('response = ', response);

      const nameList = response.data.restaurants.businesses.map((item: any, i: number) => {
        const obj = {
          name: item.name,
        };
        return obj;
      });
      setNameList(nameList);

      const locationStrList = response.data.restaurants.businesses.map((item: any, i: number) => {
        const obj = {
          locationStr: item.location.display_address.join(', '),
        };
        return obj;
      });
      setLocationStrList(locationStrList);

      const coordinatesList = response.data.restaurants.businesses.map((item: any, i: number) => {
        return item.coordinates;
      });
      setCoordinatesList(coordinatesList);

      setRefreshButtonClicked(false);
    } else {
      setRefreshButtonClicked(false);
    }
  };

  const handleRefresh = () => {
    setNameList([]);
    setLocationStrList([]);
    setCoordinatesList([]);
    setRefreshButtonClicked(true);

    const selectedTerm = _.sample(randomFoodList);
    setSelectedTerm(selectedTerm);
    if (!_.isEmpty(selectedTerm) && latitude !== 0 && longitude !== 0) {
      findRestaurantsByLatLong(selectedTerm, latitude, longitude);
      setOpenSuccessAlert(true);
      setMessage('Refresh success!');
    }
  };

  const renderRefreshButton = () => {
    let refreshButton: any = null;

    if (refreshButtonClicked === true) {
      refreshButton = (
        <div className="mt-3 d-flex justify-content-end" style={{ marginRight: '2.5em' }}>
          <Button variant="contained" color="primary" disabled={true} onClick={handleRefresh}>
            {t('loading')}
          </Button>
        </div>
      );
    } else {
      refreshButton = (
        <div className="mt-3 d-flex justify-content-end" style={{ marginRight: '2.5em' }}>
          <Button variant="contained" color="primary" onClick={handleRefresh}>
            {t('refresh')}
          </Button>
        </div>
      );
    }

    return refreshButton;
  };

  return (
    <div>
      <div className="mt-4 d-flex justify-content-end" style={{ marginRight: '2.5em' }}>
        <Typography component={'span'}>
          {!_.isEmpty(selectedTerm) ? (
            <div>
              <b>{t('currentFoodCategory')}</b> {selectedTerm}
            </div>
          ) : null}
        </Typography>
      </div>
      {renderRefreshButton()}
      <div className="mt-3" style={{ margin: '2.5em' }}>
        <CustomMapList
          latitude={latitude}
          longitude={longitude}
          nameList={nameList}
          locationStrList={locationStrList}
          coordinatesList={coordinatesList}
        />
      </div>
      <Snackbar openSuccessAlert={openSuccessAlert} message={message} />
    </div>
  );
}

export default RandomFoodMapView;
