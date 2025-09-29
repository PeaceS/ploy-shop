import Stripe from 'stripe';

export async function onRequestPost(context) {
    const { env, request } = context;
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    try {
        // const { priceId, productId } = await request.json(); 
        const priceId = 'price_1SCGKeJOHrAfEkInQlqHH5Ph';
        const { productId } = await request.json();

        console.log(productId);
        console.log(request);

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
