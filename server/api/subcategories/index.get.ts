import { eq, and } from "drizzle-orm";
import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const query = getQuery(event);

  const conditions = [eq(schema.subcategories.userId, user.id)];

  if (query.categoryId) {
    conditions.push(eq(schema.subcategories.categoryId, Number(query.categoryId)));
  }

  const subcategories = await db
    .select()
    .from(schema.subcategories)
    .where(and(...conditions))
    .orderBy(schema.subcategories.name);

  return subcategories;
});
