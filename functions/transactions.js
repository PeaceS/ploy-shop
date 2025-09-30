export async function onRequestGet(context) {
  try {
    const { env } = context;

    let query = "SELECT uuid, email, product_type, product_id, purchased_at FROM transactions WHERE status = 'pending'";
    query += " ORDER BY purchased_at DESC LIMIT 10";
    const { results } = await env.DB.prepare(query).all();

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(`Error fetching keychains: ${err.message}`, { status: 500 });
  }
}
