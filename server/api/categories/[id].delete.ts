import { eq, and } from "drizzle-orm";
import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Category ID is required",
    });
  }

  // Check if category is default (can't delete default categories)
  const [category] = await db
    .select()
    .from(schema.categories)
    .where(and(eq(schema.categories.id, Number(id)), eq(schema.categories.userId, user.id)))
    .limit(1);

  if (!category) {
    throw createError({
      statusCode: 404,
      message: "Category not found",
    });
  }

  if (category.isDefault) {
    throw createError({
      statusCode: 400,
      message: "Cannot delete default categories",
    });
  }

  const [deleted] = await db
    .delete(schema.categories)
    .where(and(eq(schema.categories.id, Number(id)), eq(schema.categories.userId, user.id)))
    .returning();

  return { success: true, id: deleted.id };
});
