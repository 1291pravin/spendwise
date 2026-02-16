export default defineEventHandler(async (event) => {
  const user = await getAuth(event);
  return { user };
});
