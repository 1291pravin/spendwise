import { eq, and } from "drizzle-orm";
import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Expense ID is required",
    });
  }

  // Update expense (only if belongs to user)
  const [updated] = await db
    .update(schema.expenses)
    .set({
      amount: body.amount !== undefined ? Number(body.amount) : undefined,
      date: body.date,
      categoryId: body.categoryId !== undefined ? Number(body.categoryId) : undefined,
      subcategoryId: body.subcategoryId !== undefined ? (body.subcategoryId ? Number(body.subcategoryId) : null) : undefined,
      description: body.description !== undefined ? body.description : undefined,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(schema.expenses.id, Number(id)), eq(schema.expenses.userId, user.id)))
    .returning();

  if (!updated) {
    throw createError({
      statusCode: 404,
      message: "Expense not found",
    });
  }

  return updated;
});
