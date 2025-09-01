function createOrder(amount, actions) {
  return actions.order.create({
    purchase_units: [{
      amount: {
        value: amount
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
    return createOrder('40.00', actions);
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
    return createOrder('50.00', actions);
  }
}).render('#paypal-button-container-2');