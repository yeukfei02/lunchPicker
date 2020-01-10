import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import MapIcon from '@material-ui/icons/Map';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsIcon from '@material-ui/icons/Settings';
import MailIcon from '@material-ui/icons/Mail';
import { red } from '@material-ui/core/colors';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function NavBar() {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const toggleDrawer = (status) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpen(status);
  };

  const handleDrawerIconClick = () => {
    setOpen(true);
  }

  const handleHomeClick = () => {
    history.push('/');
  }

  const handleRandomFoodClick = () => {
    history.push('/random-food');
  }

  const handleRandomFoodMapViewClick = () => {
    history.push('/random-food-map-view');
  }

  const handleFavouritesClick = () => {
    history.push('/favourites');
  }

  const handleSettingsClick = () => {
    history.push('/settings');
  }

  const handleContactUsClick = () => {
    history.push('/contact');
  }

  const getSideList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button key="Home" onClick={handleHomeClick}>
          <ListItemIcon><HomeIcon style={{ color: red[500] }} /></ListItemIcon>
          <ListItemText primary={t('home')} />
        </ListItem>
        <ListItem button key="Random food" onClick={handleRandomFoodClick}>
          <ListItemIcon><FastfoodIcon style={{ color: red[500] }} /></ListItemIcon>
          <ListItemText primary={t('randomFood')} />
        </ListItem>
        <ListItem button key="Random food map view" onClick={handleRandomFoodMapViewClick}>
          <ListItemIcon><MapIcon style={{ color: red[500] }} /></ListItemIcon>
          <ListItemText primary={t('randomFoodMapView')} />
        </ListItem>
        <ListItem button key="Favourites" onClick={handleFavouritesClick}>
          <ListItemIcon><FavoriteIcon style={{ color: red[500] }} /></ListItemIcon>
          <ListItemText primary={t('favourites')} />
        </ListItem>
        <ListItem button key="Settings" onClick={handleSettingsClick}>
          <ListItemIcon><SettingsIcon style={{ color: red[500] }} /></ListItemIcon>
          <ListItemText primary={t('settings')} />
        </ListItem>
        <ListItem button key="Contact us" onClick={handleContactUsClick}>
          <ListItemIcon><MailIcon style={{ color: red[500] }} /></ListItemIcon>
          <ListItemText primary={t('contactUs')} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleDrawerIconClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            LunchPicker
          </Typography>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {getSideList()}
      </SwipeableDrawer>
    </div>
  )
}

export default NavBar;
