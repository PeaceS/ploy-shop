paypal.Buttons({
  style: {
    layout: 'vertical',
    color:  'blue',
    shape:  'rect',
    label:  'paypal'
  },
  createOrder: function(_data, actions) {
    return actions.order.create({
      application_context: [{
        brand_name: 'Rungploy',
        locale: 'de-DE',
        shipping_preference: 'NO_SHIPPING'
      }],
      purchase_units: [{
        amount: {
          value: '40.00'
        }
      }]
    });
  }
}).render('#paypal-button-container-1');