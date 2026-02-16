import { db, schema } from "@nuxthub/db";
import type { NewExpense } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const body = await readBody(event);

  // Validate required fields
  if (!body.amount || !body.date || !body.categoryId) {
    throw createError({
      statusCode: 400,
      message: "Amount, date, and category are required",
    });
  }

  // Create expense
  const [expense] = await db
    .insert(schema.expenses)
    .values({
      userId: user.id,
      amount: Number(body.amount),
      date: body.date,
      categoryId: Number(body.categoryId),
      subcategoryId: body.subcategoryId ? Number(body.subcategoryId) : null,
      description: body.description || null,
    })
    .returning();

  return expense;
});
