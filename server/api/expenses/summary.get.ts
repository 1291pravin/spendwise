import { eq, and, gte, lte, sql } from "drizzle-orm";
import { db, schema } from "@nuxthub/db";
import type { MonthlySummary, CategorySummary } from "~/server/types";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const query = getQuery(event);

  // Default to current month if no dates provided
  const now = new Date();
  const dateFrom = query.dateFrom as string || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const dateTo = query.dateTo as string || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-31`;

  // Get expenses for the date range
  const expenses = await db
    .select({
      amount: schema.expenses.amount,
      categoryId: schema.expenses.categoryId,
      categoryName: schema.categories.name,
      categoryIcon: schema.categories.icon,
      categoryColor: schema.categories.color,
    })
    .from(schema.expenses)
    .leftJoin(schema.categories, eq(schema.expenses.categoryId, schema.categories.id))
    .where(
      and(
        eq(schema.expenses.userId, user.id),
        gte(schema.expenses.date, dateFrom),
        lte(schema.expenses.date, dateTo)
      )
    );

  // Calculate totals
  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const count = expenses.length;

  // Group by category
  const categoryMap = new Map<number, CategorySummary>();
  expenses.forEach((e) => {
    if (!e.categoryId) return;

    if (!categoryMap.has(e.categoryId)) {
      categoryMap.set(e.categoryId, {
        categoryId: e.categoryId,
        categoryName: e.categoryName || "Unknown",
        categoryIcon: e.categoryIcon,
        categoryColor: e.categoryColor,
        total: 0,
        count: 0,
        percentage: 0,
      });
    }

    const cat = categoryMap.get(e.categoryId)!;
    cat.total += e.amount || 0;
    cat.count += 1;
  });

  // Calculate percentages and convert to array
  const byCategory = Array.from(categoryMap.values()).map((cat) => ({
    ...cat,
    percentage: total > 0 ? (cat.total / total) * 100 : 0,
  })).sort((a, b) => b.total - a.total);

  const summary: MonthlySummary = {
    total,
    count,
    byCategory,
  };

  return summary;
});
