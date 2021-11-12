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

import { getRootUrl } from '../../helpers/helpers';

const rootUrl = getRootUrl();

const selectStyles = {
  container: (base: any, state: any) => ({
    ...base,
    opacity: state.isDisabled ? '.5' : '1',
    backgroundColor: 'transparent',
    zIndex: '999',
  }),
};

function CheckoutForm(props: any) {
  const { t } = useTranslation();

  const [currencyList, setCurrencyList] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('');

  const [token, setToken] = useState<string>('');
  const [card, setCard] = useState<any>({});

  const [openSuccessAlert, setOpenSuccessAlert] = useState<boolean>(false);
  const [openErrorAlert, setOpenErrorAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

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
    if (openSuccessAlert) {
      setOpenSuccessAlert(false);
    }
    if (openErrorAlert) {
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
  };

  const handleAmountChange = (e: any) => {
    setAmount(e.target.value);
  };

  const handleCurrencyChange = (selectedCurrency: any) => {
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
  };

  const handlePayNow = async () => {
    const response = await props.stripe.createToken();
    if (response) {
      console.log('response = ', response);
      if (!_.isEmpty(response.token)) {
        setToken(response.token.id);
        setCard(response.token.card);
      }

      if (!_.isEmpty(response.error)) {
        setOpenErrorAlert(true);
        setMessage(response.error.message);
      }
    }
  };

  const creditCardPayment = async (amount: number, currency: any, token: string, card: any) => {
    const response = await axios.post(
      `${rootUrl}/stripe/credit-card-payment`,
      {
        amount: Math.round(amount * 100),
        currency: currency.value,
        token: token,
        card: card,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      setOpenSuccessAlert(true);
      setMessage('Payment success!');
      setTimeout(() => {
        window.open(response.data.charges.receipt_url);
      }, 1000);
    } else {
      setOpenErrorAlert(true);
      setMessage('Payment failed!');
    }
  };

  const renderPayNowButton = () => {
    let payNowButton: any = null;

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
  };

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
