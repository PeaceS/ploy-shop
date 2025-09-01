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
  },
  onApprove: function(_data, actions) {
    // Here you would capture the order on your server.
    // For this example, we'll just show a success message.
    return actions.order.capture().then(function(orderData) {
        console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
        const transaction = orderData.purchase_units[0].payments.captures[0];
        alert('Transaction ' + transaction.status + ': ' + transaction.id + '\n\nSee console for all available details');
    });
  }
}).render('#paypal-button-container-2');