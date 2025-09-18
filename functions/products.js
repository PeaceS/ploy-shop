export async function onRequestGet(context) {
  try {
    const { env } = context;

    // Access the D1 binding via the name you defined (e.g., 'DB')
    const { results } = await env.DB.prepare("SELECT * FROM keychains WHERE display = true ORDER BY stock DESC").all();

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(`Error fetching keychains: ${err.message}`, { status: 500 });
  }
}
