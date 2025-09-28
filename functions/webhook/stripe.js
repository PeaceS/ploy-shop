import Stripe from 'stripe';

export async function onRequestPost(context) {
  try {
    const { env, request } = context;

    const rawBody = await request.text();
    const stripe = new Stripe(env.STRIPE_SECRET_KEY); 
    const endpointSecret = env.STRIPE_ENDPOINT_SECRET;
    const sig = request.headers.get('stripe-signature');

    let event;

    try {
      event = await stripe.webhooks.constructEventAsync(rawBody, sig, endpointSecret);
    } catch (err) {
      console.log(err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const email = session.customer_details?.email;
        const productId = session.metadata?.product_id;
        console.log(session);
        console.log(email);
        console.log(productId);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response('ok', { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new Response(`Error fetching keychains: ${err.message}`, { status: 500 });
  }
}
