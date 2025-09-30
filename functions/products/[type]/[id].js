function formatId(id) {
  const idAsString = String(id);
  const paddedId = idAsString.padStart(3, '0');

  return `TB-${paddedId}`;
}

export async function onRequestGet(context) {
  try {
    const { env, params } = context;
    const { type, id } = params;

    let item;
    if (type == 'bonds') {
      item = formatId(id);
    } else {
      const { results } = await env.DB.prepare(`SELECT item, categories_count FROM ${type} WHERE id = ?1`).bind(id).all();
      item = results[0];
      console.log(item);
    }

    return new Response(JSON.stringify(item), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', 
        'CDN-Cache-Control': 'max-age=3600'
      },
    });
  } catch (err) {
    return new Response(`Error fetching the bonds: ${err.message}`, { status: 500 });
  }
}
