export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const settings = await getUserSettings(user.id);
  return settings;
});
