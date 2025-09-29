function formatId(id) {
  const idAsString = String(id);
  const paddedId = idAsString.padStart(3, '0');

  return `TB-${paddedId}`;
}

export async function onRequestGet(context) {
  try {
    const { env, params } = context;
    const { type, id } = params;

    let itemName;
    if (type == 'bonds') {
      itemName = formatId(id);
    } else {
      const { results } = await env.DB.prepare(`SELECT item FROM ${type} WHERE id = ?1`).bind(id).all();
      itemName = results[0]?.item;
    }

    return new Response(itemName, {
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
