import { defineStore } from 'pinia';
import type { Category, Subcategory } from '~/server/db/schema';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    subcategories: [] as Subcategory[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getCategoryById: (state) => (id: number) => {
      return state.categories.find((c) => c.id === id);
    },
    getSubcategoriesByCategory: (state) => (categoryId: number) => {
      return state.subcategories.filter((s) => s.categoryId === categoryId);
    },
  },

  actions: {
    async fetchCategories() {
      try {
        this.loading = true;
        this.error = null;
        this.categories = await $fetch('/api/categories');
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch categories';
        console.error('Failed to fetch categories:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchSubcategories(categoryId?: number) {
      try {
        this.loading = true;
        this.error = null;
        const query = categoryId ? { categoryId } : {};
        this.subcategories = await $fetch('/api/subcategories', { query });
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch subcategories';
        console.error('Failed to fetch subcategories:', error);
      } finally {
        this.loading = false;
      }
    },

    async createCategory(data: { name: string; icon?: string; color?: string }) {
      try {
        const category = await $fetch('/api/categories', {
          method: 'POST',
          body: data,
        });
        this.categories.push(category);
        return category;
      } catch (error: any) {
        this.error = error.message || 'Failed to create category';
        throw error;
      }
    },

    async createSubcategory(categoryId: number, data: { name: string }) {
      try {
        const subcategory = await $fetch('/api/subcategories', {
          method: 'POST',
          body: { ...data, categoryId },
        });
        this.subcategories.push(subcategory);
        // Refresh categories to update subcategories
        await this.fetchCategories();
        return subcategory;
      } catch (error: any) {
        this.error = error.message || 'Failed to create subcategory';
        throw error;
      }
    },

    async updateCategory(id: number, data: { name?: string; icon?: string; color?: string }) {
      try {
        const category = await $fetch(`/api/categories/${id}`, {
          method: 'PATCH',
          body: data,
        });
        const index = this.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          this.categories[index] = { ...this.categories[index], ...category };
        }
        return category;
      } catch (error: any) {
        this.error = error.message || 'Failed to update category';
        throw error;
      }
    },

    async deleteCategory(id: number) {
      try {
        await $fetch(`/api/categories/${id}`, { method: 'DELETE' });
        this.categories = this.categories.filter(c => c.id !== id);
      } catch (error: any) {
        this.error = error.message || 'Failed to delete category';
        throw error;
      }
    },

    async deleteSubcategory(categoryId: number, subcategoryId: number) {
      try {
        await $fetch(`/api/subcategories/${subcategoryId}`, { method: 'DELETE' });
        this.subcategories = this.subcategories.filter(s => s.id !== subcategoryId);
        // Refresh categories to update subcategories
        await this.fetchCategories();
      } catch (error: any) {
        this.error = error.message || 'Failed to delete subcategory';
        throw error;
      }
    },
  },
});
