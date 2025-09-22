export async function onRequestGet(context) {
  try {
    const { env, request } = context;

    const url = new URL(request.url);
    const search = url.searchParams.get('search');

    let query = "SELECT * FROM keychains WHERE display = false";

    if (search) {
      query += ` AND item LIKE "%${search}%"`;
    }

    query += " ORDER BY stock DESC";
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
