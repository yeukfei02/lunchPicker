import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import EmailIcon from '@material-ui/icons/Email';
import GitHubIcon from '@material-ui/icons/GitHub';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import { StripeProvider } from 'react-stripe-elements';
import MyStoreCheckout from '../myStoreCheckout/MyStoreCheckout';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import { getStripeApiKey } from '../../helpers/helpers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

function Contact(): JSX.Element {
  const classes = useStyles();
  const { t } = useTranslation();

  const [radioButtonValue, setRadioButtonValue] = useState<string>('stripe');

  const handleEmailIconClick = () => {
    window.open('mailto:yeukfei02@gmail.com');
  };

  const handleGithubIconClick = () => {
    window.open('https://github.com/yeukfei02');
  };

  const handleDonate = () => {
    window.open('https://donorbox.org/donate-for-lunch-picker-better-features-and-development');
  };

  const handleBuyMeACoffee = () => {
    window.open('https://www.buymeacoffee.com/yeukfei02');
  };

  const handleRadioButtonChange = (e: any) => {
    setRadioButtonValue(e.target.value);
  };

  const renderDiv = () => {
    let resultDiv: any = null;

    if (_.isEqual(radioButtonValue, 'donorbox')) {
      resultDiv = (
        <div>
          <Button className="w-100" variant="outlined" color="primary" onClick={handleDonate}>
            {t('donate')}
          </Button>
        </div>
      );
    } else if (_.isEqual(radioButtonValue, 'buyMeACoffee')) {
      resultDiv = (
        <div>
          <Button className="w-100" variant="outlined" color="primary" onClick={handleBuyMeACoffee}>
            {t('buyMeACoffee')}
          </Button>
        </div>
      );
    } else if (_.isEqual(radioButtonValue, 'stripe')) {
      const stripeApiKey = getStripeApiKey() as string;
      resultDiv = (
        <div>
          <StripeProvider apiKey={stripeApiKey}>
            <MyStoreCheckout />
          </StripeProvider>
        </div>
      );
    }

    return resultDiv;
  };

  return (
    <div>
      <div className="mt-5 d-flex justify-content-center">
        <Paper className={`${classes.root} mx-4 w-75 text-center`}>
          <h5>{t('contactTitle')}</h5>
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
          <h5 className="text-center">{t('donateTitle')}</h5>
          <FormControl component="fieldset" className={classes.formControl}>
            <RadioGroup
              aria-label="position"
              name="position"
              value={radioButtonValue}
              onChange={handleRadioButtonChange}
            >
              <FormControlLabel
                value="donorbox"
                control={<Radio color="primary" />}
                label="Donorbox"
                labelPlacement="end"
              />
              <FormControlLabel
                value="buyMeACoffee"
                control={<Radio color="primary" />}
                label="Buy me a coffee"
                labelPlacement="end"
              />
              <FormControlLabel
                value="stripe"
                control={<Radio color="primary" />}
                label="Stripe"
                labelPlacement="end"
              />
            </RadioGroup>
          </FormControl>
          {renderDiv()}
        </Paper>
      </div>
    </div>
  );
}

export default Contact;
