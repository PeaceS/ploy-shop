function createOrder(amount, actions) {
  return actions.order.create({
    purchase_units: [{
      amount: {
        value: amount.toString()
      },
      breakdown: {
        tax_total: {
          value: (amount * 0.19).toString()
        }
      }
    }],
    application_context: {
      brand_name: 'Rungploy',
      locale: 'de-DE',
      shipping_preference: 'NO_SHIPPING'
    }
  });
}

paypal.Buttons({
  style: {
    layout: 'vertical',
    color:  'blue',
    shape:  'rect',
    label:  'paypal'
  },
  createOrder: function(_data, actions) {
    return createOrder(40, actions);
  }
}).render('#paypal-button-container-1');

paypal.Buttons({
  style: {
    layout: 'vertical',
    color:  'blue',
    shape:  'rect',
    label:  'paypal'
  },
  createOrder: function(_data, actions) {
    return createOrder(50, actions);
  },
  onApprove: function(_data, actions) {
    return actions.order.capture().then(function(orderData) {
        console.log(orderData.payer.name.given_name);
        console.log(orderData.payer.name.surname);
        console.log(orderData.payer.email_address);
        window.location.href = '/thank-you';
    });
  }
}).render('#paypal-button-container-2');