export async function onRequestGet(context) {
  try {
    const { env, params } = context;
    const uuid = params.uuid;

    if (!uuid) {
      return new Response("uuid is required.", { status: 400 });
    }

    const { result: transaction } = await env.DB.prepare("SELECT * FROM transactions WHERE uuid = ?1").bind(uuid).first();
    console.log(transaction);

    return new Response(JSON.stringify({ transaction: transaction }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(`Error updating the transaction: ${err.message}`, { status: 500 });
  }
}
