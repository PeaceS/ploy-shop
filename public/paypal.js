paypal.Buttons({
  style: {
    layout: 'vertical',
    color:  'blue',
    shape:  'rect',
    label:  'paypal'
  },
  createOrder: function(_data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: '40.00'
        }
      }],
      brand_name: 'Rungploy',
      locale: 'de-DE',
      shipping_preference: 'NO_SHIPPING'
    });
  }
}).render('#paypal-button-container-1');