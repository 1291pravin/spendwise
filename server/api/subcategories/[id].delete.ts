import { eq, and } from "drizzle-orm";
import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Subcategory ID is required",
    });
  }

  const [deleted] = await db
    .delete(schema.subcategories)
    .where(and(eq(schema.subcategories.id, Number(id)), eq(schema.subcategories.userId, user.id)))
    .returning();

  if (!deleted) {
    throw createError({
      statusCode: 404,
      message: "Subcategory not found",
    });
  }

  return { success: true, id: deleted.id };
});
