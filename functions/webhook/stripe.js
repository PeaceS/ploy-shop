export async function onRequestPost(context) {
  try {
    const { env, request } = context;

    console.log('.... ok');
    console.log(env.STRIPE_SECRET_KEY);
    console.log(env.STRIPE_ENDPOINT_SECRET);
    const stripe = require('stripe')(env.STRIPE_SECRET_KEY);
    const endpointSecret = env.STRIPE_ENDPOINT_SECRET;
    const sig = request.headers.get('stripe-signature');

    console.log(sig);

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log(event);
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        // Then define and call a function to handle the event checkout.session.completed
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return new Response('ok', { status: 200 });
  } catch (err) {
    return new Response(`Error fetching keychains: ${err.message}`, { status: 500 });
  }
}
