import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { red } from '@material-ui/core/colors';
import _ from 'lodash';
import axios from 'axios';

import CardView from '../cardView/CardView';
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

function Favourites() {
  const classes = useStyles();

  const [favourites, setFavourites] = useState([]);

  const [open, setOpen] = useState(true);

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [message, setMessage] = useState('');

  const currentToken = localStorage.getItem('firebaseCurrentToken');

  useEffect(() => {
    if (!_.isEmpty(currentToken)) {
      getFavourites(currentToken);
    }
  }, [currentToken]);

  useEffect(() => {
    if (openSuccessAlert === true) {
      setOpenSuccessAlert(false);
    }
    if (!_.isEmpty(message)) {
      setMessage('');
    }
  }, [openSuccessAlert, message]);

  useEffect(() => {
    if (!_.isEmpty(favourites)) {
      setTimeout(() => {
        setOpen(false)
      }, 1500);
    }
  }, [favourites]);

  const getFavourites = (currentToken) => {
    axios.get(
      `${ROOT_URL}/favourites/get-favourites`,
      {
        params: {
          currentToken: currentToken
        },
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
          <Backdrop
            className={classes.backdrop}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className="mt-4 d-flex justify-content-center">
            <Paper className={`${classes.root} mx-4 w-75 text-center`}>
              <h4>There are no result.</h4>
            </Paper>
          </div>
        </div>
      );
    }

    return renderDiv;
  }

  const renderFavourites = () => {
    let cardViewResultList = null;

    if (!_.isEmpty(favourites)) {
      cardViewResultList = favourites.map((item, i) => {
        return (
          <Grid key={i} item xs={12} sm={4}>
            <div className="d-flex justify-content-center">
              <CardView resultListItem={item.item} inFavouritesView={true} />
            </div>
          </Grid>
        );
      });
    }

    return cardViewResultList;
  }

  return (
    <div>
      <div className="mt-4 d-flex justify-content-end" style={{ marginRight: '2.5em' }}>
        <Typography component={'span'}>
          <div>
            <b>Your total favourites:</b> {favourites.length}
          </div>
        </Typography>
      </div>
      {renderDiv()}
      <Snackbar openSuccessAlert={openSuccessAlert} message={message} />
    </div >
  )
}

export default Favourites;
