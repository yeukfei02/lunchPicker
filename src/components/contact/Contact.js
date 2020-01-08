import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import EmailIcon from '@material-ui/icons/Email';
import GitHubIcon from '@material-ui/icons/GitHub';
import Button from '@material-ui/core/Button';
import { StripeProvider } from 'react-stripe-elements';
import MyStoreCheckout from '../myStoreCheckout/MyStoreCheckout';

import { getStripeApiKey } from '../../common/Common';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function Contact() {
  const classes = useStyles();

  const handleEmailIconClick = () => {
    window.open('mailto:yeukfei02@gmail.com');
  }

  const handleGithubIconClick = () => {
    window.open('https://github.com/yeukfei02');
  }

  const handleDonate = () => {
    window.open('https://donorbox.org/donate-for-lunch-picker-better-features-and-development');
  }

  return (
    <div>
      <div className="mt-5 d-flex justify-content-center">
        <Paper className={`${classes.root} mx-4 w-75 text-center`}>
          <h4>Contact us via email or visit our github repo</h4>
          <Tooltip title="yeukfei02@gmail.com" placement="bottom">
            <EmailIcon style={{ cursor: 'pointer' }} className="mr-3" fontSize="large" onClick={handleEmailIconClick} />
          </Tooltip>
          <Tooltip title="yeukfei02" placement="bottom">
            <GitHubIcon style={{ cursor: 'pointer' }} fontSize="large" onClick={handleGithubIconClick} />
          </Tooltip>
        </Paper>
      </div>
      <div className="my-5 d-flex justify-content-center">
        <Paper className={`${classes.root} mx-4 w-75`}>
          <h5 className="text-center">Donate for lunch picker better features and development</h5>
          <h6 className="my-3">Donorbox</h6>
          <Button className="w-100" variant="outlined" color="primary" onClick={handleDonate}>
            Donate
          </Button>
          <h6 className="my-3">Stripe</h6>
          <StripeProvider apiKey={getStripeApiKey()}>
            <MyStoreCheckout />
          </StripeProvider>
        </Paper>
      </div>
    </div>
  )
}

export default Contact;
