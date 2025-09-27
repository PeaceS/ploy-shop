export async function onRequestGet(context) {
  try {
    const { env, params } = context;

    const flagName = params.flag;
    console.log(flagName);
    const config = await env.FEATURE_FLAG.get(flagName);

    return new Response(config);

    if (config && config == '1') {
      return new Response(true);
    }

    return new Response(false);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
