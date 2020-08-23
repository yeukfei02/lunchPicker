import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles1 = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function MySnackbarContentWrapper(props: any) {
  const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

function SnackBar(props: any): JSX.Element {
  const [openSuccessAlert, setOpenSuccessAlert] = useState<boolean>(false);
  const [openErrorAlert, setOpenErrorAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (props.openSuccessAlert === true) {
      setOpenSuccessAlert(true);
    }
  }, [props.openSuccessAlert]);

  useEffect(() => {
    if (props.openErrorAlert === true) {
      setOpenErrorAlert(true);
    }
  }, [props.openErrorAlert]);

  useEffect(() => {
    if (!_.isEmpty(props.message)) {
      setMessage(props.message);
    }
  }, [props.message]);

  const handleClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccessAlert(false);
    setOpenErrorAlert(false);
  };

  const renderSnackBar = () => {
    let snackBar: any = null;

    if (openSuccessAlert === true) {
      snackBar = (
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={openSuccessAlert}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <MySnackbarContentWrapper onClose={handleClose} variant="success" message={message} />
        </Snackbar>
      );
    }
    if (openErrorAlert === true) {
      snackBar = (
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={openErrorAlert}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <MySnackbarContentWrapper onClose={handleClose} variant="error" message={message} />
        </Snackbar>
      );
    }

    return snackBar;
  };

  return <div>{renderSnackBar()}</div>;
}

export default SnackBar;
