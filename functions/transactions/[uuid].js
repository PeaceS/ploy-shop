export async function onRequestGet(context) {
  try {
    const { env, params } = context;
    const uuid = params.uuid;

    if (!uuid) {
      return new Response("uuid is required.", { status: 400 });
    }

    const { results } = await env.DB.prepare("SELECT * FROM transactions WHERE display = true ORDER BY stock DESC").all();

    return new Response(JSON.stringify({ message: "The transaction updated successfully." }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(`Error updating the transaction: ${err.message}`, { status: 500 });
  }
}
