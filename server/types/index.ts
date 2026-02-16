import type { User, UserSettings, Category, Subcategory, Expense } from "../db/schema";

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Session types
export interface UserSession {
  id: number;
  email: string;
  name: string;
}

// Expense with joined data
export interface ExpenseWithDetails extends Expense {
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
  subcategoryName?: string;
}

// Expense filters for queries
export interface ExpenseFilters {
  dateFrom?: string;
  dateTo?: string;
  categoryId?: number;
  subcategoryId?: number;
  search?: string;
}

// Monthly summary for reports
export interface MonthlySummary {
  total: number;
  count: number;
  byCategory: CategorySummary[];
}

export interface CategorySummary {
  categoryId: number;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
  total: number;
  count: number;
  percentage: number;
}

// Re-export schema types for convenience
export type { User, UserSettings, Category, Subcategory, Expense };
