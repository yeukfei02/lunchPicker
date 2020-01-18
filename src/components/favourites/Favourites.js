import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
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
}));

function Favourites() {
  const classes = useStyles();
  const { t } = useTranslation();

  const [favourites, setFavourites] = useState([]);

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [message, setMessage] = useState('');

  const [deleteAllFavouritesButtonClicked, setDeleteAllFavouritesButtonClicked] = useState(false);
  const [deleteAllFavouritesStatus, setDeleteAllFavouritesStatus] = useState(false);

  useEffect(() => {
    getFavourites();
  }, []);

  useEffect(() => {
    if (openSuccessAlert === true) {
      setOpenSuccessAlert(false);
    }
    if (!_.isEmpty(message)) {
      setMessage('');
    }
  }, [openSuccessAlert, message]);

  useEffect(() => {
    if (deleteAllFavouritesStatus === true) {
      setTimeout(() => {
        getFavourites();
        setDeleteAllFavouritesStatus(false);
      }, 500);
    }
  }, [deleteAllFavouritesStatus]);

  const getFavourites = () => {
    axios.get(
      `${ROOT_URL}/favourites/get-favourites`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
          const favourites = response.data.favourites;
          setFavourites(favourites);
          setOpenSuccessAlert(true);
          setMessage('Get favorites success!');
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
        }
      });
  }

  const renderDeleteAllFavouritesButton = () => {
    let deleteAllFavouritesButton = null;

    if (deleteAllFavouritesButtonClicked === true) {
      deleteAllFavouritesButton = (
        <div className="mt-3 d-flex justify-content-end" style={{ marginRight: '2.5em' }}>
          <Button variant="contained" color="primary" disabled={true} onClick={handleDeleteAllFavourites}>
            Loading...
          </Button>
        </div>
      );
    } else {
      deleteAllFavouritesButton = (
        <div className="mt-3 d-flex justify-content-end" style={{ marginRight: '2.5em' }}>
          <Button variant="contained" color="primary" onClick={handleDeleteAllFavourites}>
            {t('deleteAllFavourites')}
          </Button>
        </div>
      );
    }

    return deleteAllFavouritesButton;
  }

  const renderDiv = () => {
    let renderDiv = null;

    if (!_.isEmpty(favourites)) {
      renderDiv = (
        <div className={classes.root} style={{ overflow: 'hidden' }}>
          <Grid container spacing={3}>
            {renderFavourites()}
          </Grid>
        </div>
      );
    } else {
      renderDiv = (
        <div>
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

  const reloadFavourites = () => {
    getFavourites();
  }

  const renderFavourites = () => {
    let cardViewResultList = null;

    if (!_.isEmpty(favourites)) {
      cardViewResultList = favourites.map((item, i) => {
        return (
          <Grid key={i} item xs={12} sm={4}>
            <Fade bottom>
              <div className="d-flex justify-content-center">
                <CardView resultListItem={item} inFavouritesView={true} reloadFavourites={reloadFavourites} />
              </div>
            </Fade>
          </Grid>
        );
      });
    }

    return cardViewResultList;
  }

  const handleDeleteAllFavourites = () => {
    setDeleteAllFavouritesButtonClicked(true);

    axios.delete(
      `${ROOT_URL}/favourites/delete-all-favourites`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          log("response = ", response);
          setOpenSuccessAlert(true);
          setMessage('Delete all favorites success!');
          setDeleteAllFavouritesButtonClicked(false);
          setDeleteAllFavouritesStatus(true);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
          setDeleteAllFavouritesButtonClicked(false);
          setDeleteAllFavouritesStatus(true);
        }
      });
  }

  return (
    <div>
      <div className="mt-4 d-flex justify-content-end" style={{ marginRight: '2.5em' }}>
        <Typography component={'span'}>
          <div>
            <b>{t('yourTotalFavourites')}</b> {favourites.length}
          </div>
        </Typography>
      </div>
      {renderDeleteAllFavouritesButton()}
      {renderDiv()}
      <FloatingActionButton />
      <Snackbar openSuccessAlert={openSuccessAlert} message={message} />
    </div >
  )
}

export default Favourites;
