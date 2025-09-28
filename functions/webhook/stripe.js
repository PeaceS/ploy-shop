import Stripe from 'stripe';

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const stripe = new Stripe(env.STRIPE_SECRET_KEY); 
    const endpointSecret = env.STRIPE_ENDPOINT_SECRET;
    const sig = request.headers.get('stripe-signature');

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      console.log(err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
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
    console.log(err.message);
    return new Response(`Error fetching keychains: ${err.message}`, { status: 500 });
  }
}
