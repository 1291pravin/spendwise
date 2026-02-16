import { eq, and } from "drizzle-orm";
import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Category ID is required",
    });
  }

  const [updated] = await db
    .update(schema.categories)
    .set({
      name: body.name,
      icon: body.icon !== undefined ? body.icon : undefined,
      color: body.color !== undefined ? body.color : undefined,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(schema.categories.id, Number(id)), eq(schema.categories.userId, user.id)))
    .returning();

  if (!updated) {
    throw createError({
      statusCode: 404,
      message: "Category not found",
    });
  }

  return updated;
});
