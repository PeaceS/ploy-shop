export async function onRequestGet(context) {
  try {
    const { env } = context;
    const id = context.params.id;

    const { results } = await env.DB.prepare("SELECT * FROM bonds WHERE id = ?1").bind(id).all();

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(`Error fetching the bonds: ${err.message}`, { status: 500 });
  }
}
