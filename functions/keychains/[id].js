export async function onRequestPut(context) {
  try {
    const { env } = context;
    const id = context.params.id;

    if (!id) {
      return new Response("ID is required.", { status: 400 });
    }

    // Access the D1 binding via the name you defined (e.g., 'DB')
    const { success } = await env.DB.prepare(
      "UPDATE keychains SET stock = stock - 1 WHERE id = ?1"
    ).bind(id).run();

    if (!success) {
      return new Response(JSON.stringify({ message: "Update failed or no records found for the given ID." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ message: "Keychain updated successfully." }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(`Error updating keychain: ${err.message}`, { status: 500 });
  }
}