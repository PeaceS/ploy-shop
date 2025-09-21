export async function onRequestGet(context) {
  try {
    const { env } = context;

    // Access the D1 binding via the name you defined (e.g., 'DB')
    const { results } = await env.DB.prepare("SELECT * FROM bonds ORDER BY random() LIMIT 10").all();

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(`Error fetching the bonds: ${err.message}`, { status: 500 });
  }
}
