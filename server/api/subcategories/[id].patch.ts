import { eq, and } from "drizzle-orm";
import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Subcategory ID is required",
    });
  }

  const [updated] = await db
    .update(schema.subcategories)
    .set({
      name: body.name,
      categoryId: body.categoryId !== undefined ? Number(body.categoryId) : undefined,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(schema.subcategories.id, Number(id)), eq(schema.subcategories.userId, user.id)))
    .returning();

  if (!updated) {
    throw createError({
      statusCode: 404,
      message: "Subcategory not found",
    });
  }

  return updated;
});
