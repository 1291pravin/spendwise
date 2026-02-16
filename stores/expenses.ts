import { defineStore } from 'pinia';
import type { ExpenseWithDetails, ExpenseFilters } from '~/server/types';

export const useExpensesStore = defineStore('expenses', {
  state: () => ({
    expenses: [] as ExpenseWithDetails[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    totalAmount: (state) => state.expenses.reduce((sum, e) => sum + e.amount, 0),
    expenseCount: (state) => state.expenses.length,
  },

  actions: {
    async fetchExpenses(filters?: ExpenseFilters) {
      try {
        this.loading = true;
        this.error = null;
        this.expenses = await $fetch('/api/expenses', { query: filters || {} });
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch expenses';
        console.error('Failed to fetch expenses:', error);
      } finally {
        this.loading = false;
      }
    },

    async createExpense(data: {
      amount: number;
      date: string;
      categoryId: number;
      subcategoryId?: number;
      description?: string;
    }) {
      try {
        const expense = await $fetch('/api/expenses', {
          method: 'POST',
          body: data,
        });
        this.expenses.unshift(expense as ExpenseWithDetails);
        return expense;
      } catch (error: any) {
        this.error = error.message || 'Failed to create expense';
        throw error;
      }
    },

    async updateExpense(id: number, data: Partial<ExpenseWithDetails>) {
      try {
        const updated = await $fetch(`/api/expenses/${id}`, {
          method: 'PATCH',
          body: data,
        });
        const index = this.expenses.findIndex((e) => e.id === id);
        if (index !== -1) {
          this.expenses[index] = { ...this.expenses[index], ...updated };
        }
        return updated;
      } catch (error: any) {
        this.error = error.message || 'Failed to update expense';
        throw error;
      }
    },

    async deleteExpense(id: number) {
      try {
        await $fetch(`/api/expenses/${id}`, { method: 'DELETE' });
        this.expenses = this.expenses.filter((e) => e.id !== id);
      } catch (error: any) {
        this.error = error.message || 'Failed to delete expense';
        throw error;
      }
    },
  },
});
