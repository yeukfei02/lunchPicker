import React from 'react';
import { injectStripe } from 'react-stripe-elements';
import Button from '@material-ui/core/Button';

import CardSection from './CardSection';

function CheckoutForm(props) {
  const handlePayNow = () => {
    props.stripe.confirmCardPayment('{PAYMENT_INTENT_CLIENT_SECRET}', {
      payment_method: {
        card: props.elements.getElement('card'),
        billing_details: {
          name: 'Jenny Rosen',
        },
      }
    });
  };

  return (
    <div>
      <CardSection />
      <Button className="w-100 my-2" variant="outlined" color="primary" onClick={handlePayNow}>
        Pay now
      </Button>
    </div>
  );
}

export default injectStripe(CheckoutForm);
