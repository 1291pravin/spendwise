<template>
  <AppLayout>
    <!-- Page Title -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Categories</h1>
      <p class="text-sm text-gray-500">Organize your expenses with categories</p>
    </div>

    <!-- Add Category Button -->
    <div class="mb-6">
      <button @click="openAddCategoryModal" class="btn btn-primary">
        + Add Category
      </button>
    </div>

    <!-- Categories List -->
    <div class="space-y-4">
      <div
        v-for="category in categories"
        :key="category.id"
        class="card"
      >
        <!-- Category Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                 :style="{ backgroundColor: category.color + '20' }">
              {{ category.icon }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ category.name }}</h3>
              <p class="text-xs text-gray-500">
                {{ category.subcategories?.length || 0 }} subcategories
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="editCategory(category)"
              class="text-sky-600 hover:text-sky-700 text-sm"
            >
              Edit
            </button>
            <button
              v-if="!category.isDefault"
              @click="deleteCategory(category)"
              class="text-red-600 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Subcategories -->
        <div v-if="category.subcategories && category.subcategories.length > 0">
          <div class="border-t pt-3 mt-3">
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-medium text-gray-700">Subcategories</h4>
              <button
                @click="addSubcategory(category)"
                class="text-xs text-sky-600 hover:text-sky-700"
              >
                + Add
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="sub in category.subcategories"
                :key="sub.id"
                class="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm"
              >
                <span>{{ sub.name }}</span>
                <button
                  @click="deleteSubcategory(category, sub)"
                  class="text-gray-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="border-t pt-3 mt-3">
          <button
            @click="addSubcategory(category)"
            class="text-sm text-gray-500 hover:text-sky-600"
          >
            + Add subcategory
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div v-if="showCategoryModal" class="modal-overlay" @click.self="closeCategoryModal">
      <div class="modal-content max-w-lg">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingCategory ? 'Edit Category' : 'Add Category' }}
        </h3>

        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label class="input-label">Name *</label>
            <input
              v-model="categoryForm.name"
              type="text"
              class="input"
              placeholder="Category name"
            />
          </div>

          <!-- Icon Picker -->
          <div>
            <label class="input-label">Icon *</label>
            <div class="grid grid-cols-10 gap-2 p-3 border border-gray-300 rounded-lg">
              <button
                v-for="icon in availableIcons"
                :key="icon"
                @click="categoryForm.icon = icon"
                class="w-8 h-8 flex items-center justify-center text-xl rounded hover:bg-gray-100 transition-colors"
                :class="{ 'bg-sky-100 ring-2 ring-sky-500': categoryForm.icon === icon }"
              >
                {{ icon }}
              </button>
            </div>
          </div>

          <!-- Color Picker -->
          <div>
            <label class="input-label">Color *</label>
            <div class="grid grid-cols-5 gap-2 p-3 border border-gray-300 rounded-lg">
              <button
                v-for="color in availableColors"
                :key="color"
                @click="categoryForm.color = color"
                class="w-10 h-10 rounded-full transition-all"
                :style="{ backgroundColor: color }"
                :class="{ 'ring-4 ring-gray-300': categoryForm.color === color }"
              ></button>
            </div>
          </div>
        </div>

        <div class="flex gap-2 mt-6">
          <button @click="saveCategory" class="flex-1 btn btn-primary">
            {{ editingCategory ? 'Update' : 'Add' }}
          </button>
          <button @click="closeCategoryModal" class="flex-1 btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Add Subcategory Modal -->
    <div v-if="showSubcategoryModal" class="modal-overlay" @click.self="showSubcategoryModal = false">
      <div class="modal-content">
        <h3 class="text-lg font-semibold mb-4">Add Subcategory</h3>

        <div>
          <label class="input-label">Subcategory Name *</label>
          <input
            v-model="subcategoryForm.name"
            type="text"
            class="input"
            placeholder="Subcategory name"
            @keyup.enter="saveSubcategory"
          />
        </div>

        <div class="flex gap-2 mt-6">
          <button @click="saveSubcategory" class="flex-1 btn btn-primary">
            Add
          </button>
          <button @click="showSubcategoryModal = false" class="flex-1 btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Category Confirmation -->
    <div v-if="showDeleteCategoryModal" class="modal-overlay" @click.self="showDeleteCategoryModal = false">
      <div class="modal-content">
        <h3 class="text-lg font-semibold mb-4">Delete Category</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this category? All associated expenses will lose their category assignment.
        </p>
        <div class="flex gap-2">
          <button @click="confirmDeleteCategory" class="flex-1 btn btn-danger">
            Delete
          </button>
          <button @click="showDeleteCategoryModal = false" class="flex-1 btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const categoriesStore = useCategoriesStore();

// Available icons and colors
const availableIcons = [
  '🍔', '🚗', '🏠', '⚡', '🎮', '🎬', '🛒', '✈️', '🏥', '💊',
  '🎓', '📚', '💼', '👔', '🎨', '🏋️', '☕', '🍕', '🎵', '🐕',
];

const availableColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
];

// State
const showCategoryModal = ref(false);
const showSubcategoryModal = ref(false);
const showDeleteCategoryModal = ref(false);
const editingCategory = ref<any>(null);
const selectedCategory = ref<any>(null);
const categoryToDelete = ref<any>(null);

const categoryForm = ref({
  name: '',
  icon: '📝',
  color: '#0ea5e9',
});

const subcategoryForm = ref({
  name: '',
});

// Computed
const categories = computed(() => categoriesStore.categories);

// Load data
onMounted(async () => {
  await categoriesStore.fetchCategories();
});

// Methods
function openAddCategoryModal() {
  editingCategory.value = null;
  categoryForm.value = {
    name: '',
    icon: '📝',
    color: '#0ea5e9',
  };
  showCategoryModal.value = true;
}

function editCategory(category: any) {
  editingCategory.value = category;
  categoryForm.value = {
    name: category.name,
    icon: category.icon,
    color: category.color,
  };
  showCategoryModal.value = true;
}

function deleteCategory(category: any) {
  categoryToDelete.value = category;
  showDeleteCategoryModal.value = true;
}

async function confirmDeleteCategory() {
  if (!categoryToDelete.value) return;

  try {
    await categoriesStore.deleteCategory(categoryToDelete.value.id);
    showDeleteCategoryModal.value = false;
    categoryToDelete.value = null;
  } catch (error) {
    alert('Failed to delete category');
  }
}

async function saveCategory() {
  if (!categoryForm.value.name) {
    alert('Please enter a category name');
    return;
  }

  try {
    if (editingCategory.value) {
      await categoriesStore.updateCategory(editingCategory.value.id, categoryForm.value);
    } else {
      await categoriesStore.createCategory(categoryForm.value);
    }
    closeCategoryModal();
  } catch (error) {
    alert('Failed to save category');
  }
}

function closeCategoryModal() {
  showCategoryModal.value = false;
  editingCategory.value = null;
  categoryForm.value = {
    name: '',
    icon: '📝',
    color: '#0ea5e9',
  };
}

function addSubcategory(category: any) {
  selectedCategory.value = category;
  subcategoryForm.value.name = '';
  showSubcategoryModal.value = true;
}

async function saveSubcategory() {
  if (!subcategoryForm.value.name || !selectedCategory.value) {
    alert('Please enter a subcategory name');
    return;
  }

  try {
    await categoriesStore.createSubcategory(selectedCategory.value.id, {
      name: subcategoryForm.value.name,
    });
    showSubcategoryModal.value = false;
    selectedCategory.value = null;
    subcategoryForm.value.name = '';
  } catch (error) {
    alert('Failed to add subcategory');
  }
}

async function deleteSubcategory(category: any, subcategory: any) {
  if (!confirm('Delete this subcategory?')) return;

  try {
    await categoriesStore.deleteSubcategory(category.id, subcategory.id);
  } catch (error) {
    alert('Failed to delete subcategory');
  }
}
</script>
