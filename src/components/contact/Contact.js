import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function Contact() {
  const classes = useStyles();

  return (
    <div className="mt-5 d-flex justify-content-center">
      <Paper className={`${classes.root} mx-4 w-75 text-center`}>
        <h4>Please contact us in email or visit our github repo</h4>
        <h5>Email: yeukfei02@gmail.com</h5>
        <h5>Github: yeukfei02</h5>
      </Paper>
    </div >
  )
}

export default Contact;
