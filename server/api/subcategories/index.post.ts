import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const body = await readBody(event);

  if (!body.name || !body.categoryId) {
    throw createError({
      statusCode: 400,
      message: "Name and category ID are required",
    });
  }

  const [subcategory] = await db
    .insert(schema.subcategories)
    .values({
      userId: user.id,
      categoryId: Number(body.categoryId),
      name: body.name,
    })
    .returning();

  return subcategory;
});
