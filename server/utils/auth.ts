import type { H3Event } from "h3";
import { eq } from "drizzle-orm";
import { db, schema } from "@nuxthub/db";

/**
 * Require authentication and return user session
 * Throws 401 error if user is not authenticated
 */
export async function requireAuth(event: H3Event) {
  const session = await requireUserSession(event);
  return session.user as { id: number; email: string; name: string };
}

/**
 * Get user session without requiring authentication
 * Returns null if not authenticated
 */
export async function getAuth(event: H3Event) {
  const session = await getUserSession(event);
  return session.user as { id: number; email: string; name: string } | null;
}

/**
 * Find user by email address
 */
export async function findUserByEmail(email: string) {
  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return rows[0] || null;
}

/**
 * Find user by Google ID
 */
export async function findUserByGoogleId(googleId: string) {
  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.googleId, googleId))
    .limit(1);
  return rows[0] || null;
}

/**
 * Create a new user
 */
export async function createUser(data: {
  email: string;
  name: string;
  googleId: string;
}) {
  const [user] = await db
    .insert(schema.users)
    .values({
      email: data.email,
      name: data.name,
      googleId: data.googleId,
    })
    .returning();
  return user;
}

/**
 * Create default user settings
 */
export async function createUserSettings(userId: number) {
  const [settings] = await db
    .insert(schema.userSettings)
    .values({
      userId,
      currencySymbol: "$",
      monthlyBudget: null,
      billingCycleStartDay: 1,
    })
    .returning();
  return settings;
}

/**
 * Get or create user settings
 */
export async function getUserSettings(userId: number) {
  const rows = await db
    .select()
    .from(schema.userSettings)
    .where(eq(schema.userSettings.userId, userId))
    .limit(1);

  if (rows[0]) {
    return rows[0];
  }

  // Create default settings if not exists
  return createUserSettings(userId);
}
