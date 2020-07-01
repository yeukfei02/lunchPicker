import React from 'react';
import { CardElement } from 'react-stripe-elements';

const style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
};

function CardSection() {
  return <CardElement className="MyCardElement" style={style} hidePostalCode={true} />;
}

export default CardSection;
