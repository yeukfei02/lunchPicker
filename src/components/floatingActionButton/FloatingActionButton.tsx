import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
}));

function FloatingActionButton(): JSX.Element {
  const classes = useStyles();

  const [showFab, setShowFab] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight) {
        setShowFab(true);
      }
      if (window.scrollY === 0) {
        setShowFab(false);
      }
    });
  }, []);

  const scrollToTop = () => {
    window.scroll(0, 0);
    setShowFab(false);
  };

  const renderFab = () => {
    let fab: any = null;

    if (showFab) {
      fab = (
        <Fab className={classes.fab} style={{ zIndex: 999 }} color="primary" aria-label="up" onClick={scrollToTop}>
          <UpIcon />
        </Fab>
      );
    }

    return fab;
  };

  return renderFab();
}

export default FloatingActionButton;
