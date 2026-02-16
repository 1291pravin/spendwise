import { eq } from "drizzle-orm";
import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const body = await readBody(event);

  // Validate billing cycle day (1-31)
  if (body.billingCycleStartDay !== undefined) {
    const day = Number(body.billingCycleStartDay);
    if (day < 1 || day > 31) {
      throw createError({
        statusCode: 400,
        message: "Billing cycle start day must be between 1 and 31",
      });
    }
  }

  // Get or create settings
  const currentSettings = await getUserSettings(user.id);

  // Update settings
  const [updated] = await db
    .update(schema.userSettings)
    .set({
      currencySymbol: body.currencySymbol !== undefined ? body.currencySymbol : undefined,
      monthlyBudget: body.monthlyBudget !== undefined ? (body.monthlyBudget ? Number(body.monthlyBudget) : null) : undefined,
      billingCycleStartDay: body.billingCycleStartDay !== undefined ? Number(body.billingCycleStartDay) : undefined,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(schema.userSettings.userId, user.id))
    .returning();

  return updated;
});
