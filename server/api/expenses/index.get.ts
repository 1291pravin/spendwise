import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { db, schema } from "@nuxthub/db";
import type { ExpenseFilters } from "~/server/types";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const query = getQuery(event) as ExpenseFilters;

  // Build query conditions
  const conditions = [eq(schema.expenses.userId, user.id)];

  if (query.dateFrom) {
    conditions.push(gte(schema.expenses.date, query.dateFrom));
  }
  if (query.dateTo) {
    conditions.push(lte(schema.expenses.date, query.dateTo));
  }
  if (query.categoryId) {
    conditions.push(eq(schema.expenses.categoryId, Number(query.categoryId)));
  }
  if (query.subcategoryId) {
    conditions.push(eq(schema.expenses.subcategoryId, Number(query.subcategoryId)));
  }

  // Query expenses with category details
  const expenses = await db
    .select({
      id: schema.expenses.id,
      userId: schema.expenses.userId,
      amount: schema.expenses.amount,
      date: schema.expenses.date,
      categoryId: schema.expenses.categoryId,
      subcategoryId: schema.expenses.subcategoryId,
      description: schema.expenses.description,
      createdAt: schema.expenses.createdAt,
      updatedAt: schema.expenses.updatedAt,
      categoryName: schema.categories.name,
      categoryIcon: schema.categories.icon,
      categoryColor: schema.categories.color,
      subcategoryName: schema.subcategories.name,
    })
    .from(schema.expenses)
    .leftJoin(schema.categories, eq(schema.expenses.categoryId, schema.categories.id))
    .leftJoin(schema.subcategories, eq(schema.expenses.subcategoryId, schema.subcategories.id))
    .where(and(...conditions))
    .orderBy(desc(schema.expenses.date), desc(schema.expenses.createdAt));

  // Filter by search term if provided (client-side filtering for simplicity)
  let result = expenses;
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    result = expenses.filter(
      (e) =>
        e.description?.toLowerCase().includes(searchLower) ||
        e.categoryName?.toLowerCase().includes(searchLower) ||
        e.subcategoryName?.toLowerCase().includes(searchLower)
    );
  }

  return result;
});
