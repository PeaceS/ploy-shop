import Stripe from 'stripe';

export async function onRequestPost(context) {
    const { env, request } = context;
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    try {
        const { priceId, productId } = await request.json(); 

        const protocol = 'https';
        const host = request.headers.get('host');
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${protocol}://${host}/success`,
            cancel_url: `${protocol}://${host}/cancel`,
            metadata: {
                product_id: productId,
                product_type: 'keychains'
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
