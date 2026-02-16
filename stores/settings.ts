import { defineStore } from 'pinia';
import type { UserSettings } from '~/server/db/schema';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: null as UserSettings | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    currencySymbol: (state) => state.settings?.currencySymbol || '$',
    monthlyBudget: (state) => state.settings?.monthlyBudget,
    billingCycleStartDay: (state) => state.settings?.billingCycleStartDay || 1,
  },

  actions: {
    async fetchSettings() {
      try {
        this.loading = true;
        this.error = null;
        this.settings = await $fetch('/api/settings');
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch settings';
        console.error('Failed to fetch settings:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateSettings(data: {
      currencySymbol?: string;
      monthlyBudget?: number | null;
      billingCycleStartDay?: number;
    }) {
      try {
        this.settings = await $fetch('/api/settings', {
          method: 'PATCH',
          body: data,
        });
      } catch (error: any) {
        this.error = error.message || 'Failed to update settings';
        throw error;
      }
    },
  },
});
