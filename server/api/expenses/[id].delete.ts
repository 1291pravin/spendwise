import { eq, and } from "drizzle-orm";
import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Expense ID is required",
    });
  }

  // Delete expense (only if belongs to user)
  const [deleted] = await db
    .delete(schema.expenses)
    .where(and(eq(schema.expenses.id, Number(id)), eq(schema.expenses.userId, user.id)))
    .returning();

  if (!deleted) {
    throw createError({
      statusCode: 404,
      message: "Expense not found",
    });
  }

  return { success: true, id: deleted.id };
});
