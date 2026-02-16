import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core";

// Users table - stores authentication data
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  googleId: text("google_id").unique(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// User settings - per-user preferences
export const userSettings = sqliteTable("user_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  currencySymbol: text("currency_symbol").notNull().default("$"),
  monthlyBudget: real("monthly_budget"), // null means no budget set
  billingCycleStartDay: integer("billing_cycle_start_day").notNull().default(1), // 1-31
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Categories - expense categories with multi-tenant support
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  icon: text("icon"), // emoji or icon name
  color: text("color"), // tailwind color or hex
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false), // default categories can't be deleted
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
  // Ensure unique category names per user
  userNameUnique: uniqueIndex("categories_user_name_unique").on(table.userId, table.name),
}));

// Subcategories - linked to categories
export const subcategories = sqliteTable("subcategories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
  // Ensure unique subcategory names per category per user
  userCategoryNameUnique: uniqueIndex("subcategories_user_category_name_unique")
    .on(table.userId, table.categoryId, table.name),
}));

// Expenses - main transaction records
export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(), // use real for decimal amounts
  date: text("date").notNull(), // YYYY-MM-DD format
  categoryId: integer("category_id").notNull().references(() => categories.id),
  subcategoryId: integer("subcategory_id").references(() => subcategories.id),
  description: text("description"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
  // Indexes for common query patterns
  userIdIdx: uniqueIndex("expenses_user_id_idx").on(table.userId),
  dateIdx: uniqueIndex("expenses_date_idx").on(table.date),
  categoryIdx: uniqueIndex("expenses_category_idx").on(table.categoryId),
  // Composite index for filtering by user and date range
  userDateIdx: uniqueIndex("expenses_user_date_idx").on(table.userId, table.date),
}));

// Type exports for use in API routes
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Subcategory = typeof subcategories.$inferSelect;
export type NewSubcategory = typeof subcategories.$inferInsert;

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
