import React, { useState, useEffect } from 'react';
import { injectStripe } from 'react-stripe-elements';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import _ from 'lodash';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import CardSection from './CardSection';
import Snackbar from '../snackBar/SnackBar';

import { getRootUrl, log } from '../../common/Common';

const ROOT_URL = getRootUrl();

const selectStyles = {
  container: (base, state) => ({
    ...base,
    opacity: state.isDisabled ? ".5" : "1",
    backgroundColor: "transparent",
    zIndex: "999"
  })
};

function CheckoutForm(props) {
  const { t } = useTranslation();

  const [currencyList, setCurrencyList] = useState([]);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('');

  const [token, setToken] = useState('');
  const [card, setCard] = useState({});

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getCurrencyList();
  }, []);

  useEffect(() => {
    if (amount > 0 && !_.isEmpty(currency) && !_.isEmpty(token) && !_.isEmpty(card)) {
      creditCardPayment(amount, currency, token, card);
      setToken('');
      setCard({});
    }
  }, [amount, currency, token, card]);

  useEffect(() => {
    if (openSuccessAlert === true) {
      setOpenSuccessAlert(false);
    }
    if (openErrorAlert === true) {
      setOpenErrorAlert(false);
    }
    if (!_.isEmpty(message)) {
      setMessage('');
    }
  }, [openSuccessAlert, openErrorAlert, message]);

  const getCurrencyList = () => {
    const currencyList = [
      { value: 'hkd', label: 'Hong Kong Dollar (HKD)' },
      { value: 'sgd', label: 'Singapore Dollar (SGD)' },
      { value: 'gbp', label: 'British Dollar Pound (GBP)' },
      { value: 'cny', label: 'Chinese Renminbi Yuan (CNY)' },
      { value: 'usd', label: 'US Dollar (USD)' },
    ];
    setCurrencyList(currencyList);
  }

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  }

  const handleCurrencyChange = (selectedCurrency) => {
    setCurrency(selectedCurrency);

    if (!_.isEmpty(selectedCurrency)) {
      switch (selectedCurrency.value) {
        case 'hkd':
          setAmount(3);
          break;
        case 'sgd':
          setAmount(1);
          break;
        case 'gbp':
          setAmount(1);
          break;
        case 'cny':
          setAmount(3);
          break;
        case 'usd':
          setAmount(1);
          break;
        default:

      }
    }
  }

  const handlePayNow = () => {
    props.stripe.createToken()
      .then((response) => {
        log("response = ", response);
        if (!_.isEmpty(response.token)) {
          setToken(response.token.id);
          setCard(response.token.card);
        }

        if (!_.isEmpty(response.error)) {
          setOpenErrorAlert(true);
          setMessage(response.error.message);
        }
      })
      .catch((error) => {
        log("error = ", error);
      });
  };

  const creditCardPayment = (amount, currency, token, card) => {
    axios.post(
      `${ROOT_URL}/stripe/credit-card-payment`,
      {
        amount: Math.round(amount * 100),
        currency: currency.value,
        token: token,
        card: card
      },
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
          setMessage('Payment success!');
          setTimeout(() => {
            window.open(response.data.charges.receipt_url);
          }, 1000);
        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          log("error = ", error);
          setOpenErrorAlert(true);
          setMessage('Payment failed!');
        }
      });
  }

  const renderPayNowButton = () => {
    let payNowButton = null;

    if (amount === 0 && _.isEmpty(currency) && _.isEmpty(token) && _.isEmpty(card)) {
      payNowButton = (
        <Button className="w-100" variant="outlined" color="primary" disabled={true} onClick={handlePayNow}>
          {t('payNow')}
        </Button>
      );
    } else {
      payNowButton = (
        <Button className="w-100" variant="outlined" color="primary" onClick={handlePayNow}>
          {t('payNow')}
        </Button>
      );
    }

    return payNowButton;
  }

  return (
    <div>
      <TextField
        id="amount"
        label="Amount"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        variant="outlined"
        value={amount}
        onChange={handleAmountChange}
      />
      <Select
        styles={selectStyles}
        placeholder={t('selectCurrency')}
        value={currency}
        onChange={handleCurrencyChange}
        options={currencyList}
        isClearable={true}
      />
      <CardSection />
      {renderPayNowButton()}
      <Snackbar openSuccessAlert={openSuccessAlert} openErrorAlert={openErrorAlert} message={message} />
    </div>
  );
}

export default injectStripe(CheckoutForm);
