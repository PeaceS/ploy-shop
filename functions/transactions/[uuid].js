export async function onRequestGet(context) {
  try {
    const { env, params } = context;
    const uuid = params.uuid;

    if (!uuid) {
      return new Response("uuid is required.", { status: 400 });
    }

    const oneHourAgo = Math.floor(Date.now() / 1000) - 3600; // Current time minus 1 hour in seconds
    const result = await env.DB.prepare("SELECT * FROM transactions WHERE uuid = ?1 AND purchased_at >= ?2").bind(uuid, oneHourAgo).first();
    return new Response(JSON.stringify({ transaction: result }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(`Error cannot find the transaction: ${err.message}`, { status: 404 });
  }
}
