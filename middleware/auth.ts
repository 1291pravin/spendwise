export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession();

  // Redirect to home if not logged in and trying to access protected route
  if (!loggedIn.value && to.path !== '/') {
    return navigateTo('/');
  }

  // Redirect to dashboard if logged in and trying to access home
  if (loggedIn.value && to.path === '/') {
    return navigateTo('/dashboard');
  }
});
