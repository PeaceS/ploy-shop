export async function onRequestPut(context) {
  async function updateSpecificStock(id, env) {
    const { success } = await env.DB.prepare(
      "UPDATE keychains SET stock = stock - 1 WHERE id = ?1"
    ).bind(id).run();

    if (!success) {
      return new Response(JSON.stringify({ message: "Update failed or no records found for the given ID." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  async function updateCategoryStock(id, env) {
    const { results } = await env.DB.prepare("SELECT item FROM keychains WHERE id = ?1").bind(id).all();
    const keychainCategory = results[0].item.split(" - ")[0];

    const { success } = await env.DB.prepare(
      "UPDATE keychains SET stock = stock - 1 WHERE item = ?1 AND display = true"
    ).bind(keychainCategory).run();

    if (!success) {
      return new Response(JSON.stringify({ message: "Update failed or no records found for the given item name." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  try {
    const { env, params } = context;
    const id = params.id;

    if (!id) {
      return new Response("ID is required.", { status: 400 });
    }

    const specificUpdateResult = await updateSpecificStock(id, env);
    if (specificUpdateResult) {
      return specificUpdateResult;
    }

    const categoryUpdateResult = await updateCategoryStock(id, env);
    if (categoryUpdateResult) {
      return categoryUpdateResult;
    }

    return new Response(JSON.stringify({ message: "Keychain updated successfully." }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(`Error updating keychain: ${err.message}`, { status: 500 });
  }
}