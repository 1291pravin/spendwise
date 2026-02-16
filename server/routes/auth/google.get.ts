export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user: googleUser }) {
    // Try to find by Google ID first
    let user = await findUserByGoogleId(googleUser.sub);

    if (!user) {
      // Try to find by email and link Google account
      user = await findUserByEmail(googleUser.email);
      if (user) {
        // Link Google ID to existing user
        await db
          .update(schema.users)
          .set({ googleId: googleUser.sub })
          .where(eq(schema.users.id, user.id));
      } else {
        // Create new user
        user = await createUser({
          email: googleUser.email,
          name: googleUser.name || googleUser.email,
          googleId: googleUser.sub,
        });

        // Create default settings for new user
        await createUserSettings(user.id);

        // Seed default expense categories
        await seedDefaultCategories(user.id);
      }
    }

    // Set user session
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    // Redirect to dashboard
    return sendRedirect(event, "/dashboard");
  },

  onError(event, error) {
    console.error("Google OAuth error:", error);
    return sendRedirect(event, "/?error=oauth");
  },
});
