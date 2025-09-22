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

export async function onRequestPut(context) {
  async function updateSpecificStock(id, env) {
    const { success } = await env.DB.prepare(
      "UPDATE bonds SET sold = true WHERE id = ?1"
    ).bind(id).run();

    if (!success) {
      return new Response(JSON.stringify({ message: "Update failed or no records found for the given ID." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  try {
    const { env } = context;
    const id = context.params.id;

    if (!id) {
      return new Response("ID is required.", { status: 400 });
    }

    const specificUpdateResult = await updateSpecificStock(id, env);
    if (specificUpdateResult) {
      return specificUpdateResult;
    }

    return new Response(JSON.stringify({ message: "The Bond updated successfully." }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(`Error updating the bond: ${err.message}`, { status: 500 });
  }
}
