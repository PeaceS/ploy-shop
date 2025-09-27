export async function onRequestGet(context) {
  try {
    const { env, params } = context;

    const flagName = params.flag;
    const config = await env.FEATURE_FLAGS.get(flagName);

    if (config && config == '1') {
      return Response(true);
    }

    return Response(false);
  } catch (err) {
    return Response(false);
  }
}
