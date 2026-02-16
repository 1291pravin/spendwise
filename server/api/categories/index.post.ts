import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const body = await readBody(event);

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: "Category name is required",
    });
  }

  const [category] = await db
    .insert(schema.categories)
    .values({
      userId: user.id,
      name: body.name,
      icon: body.icon || null,
      color: body.color || null,
      isDefault: false, // User-created categories are never default
    })
    .returning();

  return category;
});
