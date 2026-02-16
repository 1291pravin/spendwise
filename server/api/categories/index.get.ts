import { eq } from "drizzle-orm";
import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);

  const categories = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.userId, user.id))
    .orderBy(schema.categories.name);

  return categories;
});
