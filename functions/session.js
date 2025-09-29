import Stripe from 'stripe';

export async function onRequestPost(context) {
    const { env, request } = context;
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    try {
        // const { priceId, productId } = await request.json(); 
        const priceId = 'price_1SCH1jJnhtwlv0mpGCbzAsb6';
        const { productId } = await request.json();

        console.log(productId);
        console.log(request);

        const prices = await stripe.prices.list({
          limit: 10
        });
        const mode = prices.data.length > 0 ? prices.data[0].livemode ? 'LIVE' : 'TEST' : 'UNKNOWN';
        console.log(`mode: ${mode}`);
        console.log(prices.data[0]);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: 'payment',
            metadata: {
                product_id: productId 
            },
        });

        return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.log(error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
