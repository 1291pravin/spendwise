import { db, schema } from "@nuxthub/db";

/**
 * Default expense categories to seed for new users
 */
const DEFAULT_CATEGORIES = [
  { name: "Food & Dining", icon: "🍔", color: "orange" },
  { name: "Transportation", icon: "🚗", color: "blue" },
  { name: "Shopping", icon: "🛒", color: "purple" },
  { name: "Entertainment", icon: "🎬", color: "pink" },
  { name: "Bills & Utilities", icon: "💡", color: "yellow" },
  { name: "Health & Fitness", icon: "🏥", color: "red" },
  { name: "Education", icon: "📚", color: "green" },
  { name: "Others", icon: "📝", color: "gray" },
];

/**
 * Seed default categories for a new user
 */
export async function seedDefaultCategories(userId: number) {
  const categories = await db
    .insert(schema.categories)
    .values(
      DEFAULT_CATEGORIES.map((cat) => ({
        userId,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        isDefault: true, // Mark as default so they can't be deleted
      }))
    )
    .returning();

  return categories;
}
