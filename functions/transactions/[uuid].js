export async function onRequestPut(context) {
  async function confirm(uuid, db) {
    const { success } = await db.prepare(
      "UPDATE transactions SET status = 'success' WHERE uuid = ?1"
    ).bind(uuid).run();

    if (!success) {
      return new Response(JSON.stringify({ message: "Update failed or no records found for the given uuid." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  try {
    const { env, params } = context;
    const uuid = params.uuid;

    if (!uuid) {
      return new Response("uuid is required.", { status: 400 });
    }

    const specificUpdateResult = await confirm(uuid, env.DB);
    if (specificUpdateResult) {
      return specificUpdateResult;
    }

    return new Response(JSON.stringify({ message: "The transaction updated successfully." }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(`Error updating the transaction: ${err.message}`, { status: 500 });
  }
}
