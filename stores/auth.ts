import { defineStore } from 'pinia';

interface User {
  id: number;
  email: string;
  name: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async fetchUser() {
      try {
        this.loading = true;
        const { user } = await $fetch('/api/auth/session');
        this.user = user;
      } catch (error) {
        this.user = null;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' });
        this.user = null;
        navigateTo('/');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },

    setUser(user: User) {
      this.user = user;
    },
  },
});
