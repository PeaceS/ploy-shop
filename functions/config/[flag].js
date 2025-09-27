export async function onRequestGet(context) {
  try {
    const { env, params } = context;

    const flagName = params.flag;
    const config = await env.FEATURE_FLAGS.get(flagName);

    let isEnabled = false;

    if (config && config == '1') {
      isEnabled = true;
    }

    return new Response(JSON.stringify({ isEnabled: isEnabled }), {
      headers: {
        'Content-Type': 'application/json' // Crucial for telling the client to expect JSON
      }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
