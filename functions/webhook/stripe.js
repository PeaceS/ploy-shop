import Stripe from 'stripe';

export async function onRequestPost(context) {
  async function createTransaction(db, session) {
    const productId = session.metadata?.product_id || 0;
    const productType = session.metadata?.product_type;
    const email = session.customer_details?.email;
    const price = session.amount_total;
    const currentTime = Math.floor(Date.now() / 1000);

    console.log(session);

    await db.prepare(
      "INSERT INTO transactions \
      (uuid, product_type, product_id, price, purchased_at, type, email) \
      VALUES (?1, ?6, ?2, ?5, ?3, 'stripe', ?4);"
    ).bind(session.id, productId, currentTime, email, price, productType).run();
  }

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
        await createTransaction(env.DB, event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type} ...`);
    }

    return new Response('ok', { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new Response(`Error fetching keychains: ${err.message}`, { status: 500 });
  }
}
