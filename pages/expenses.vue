<template>
  <AppLayout>
    <!-- Page Title -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Expenses</h1>
      <p class="text-sm text-gray-500">Manage your expense transactions</p>
    </div>

    <!-- Filter Card -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label class="input-label">Search</label>
          <input
            v-model="filters.search"
            type="text"
            class="input"
            placeholder="Description..."
          />
        </div>

        <!-- Date From -->
        <div>
          <label class="input-label">From Date</label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="input"
          />
        </div>

        <!-- Date To -->
        <div>
          <label class="input-label">To Date</label>
          <input
            v-model="filters.dateTo"
            type="date"
            class="input"
          />
        </div>

        <!-- Category -->
        <div>
          <label class="input-label">Category</label>
          <select v-model="filters.categoryId" class="input">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.icon }} {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex gap-2 mt-4">
        <button @click="clearFilters" class="btn btn-secondary">
          Clear Filters
        </button>
        <button @click="showAddModal = true" class="btn btn-primary ml-auto">
          + Add Expense
        </button>
      </div>
    </div>

    <!-- Expenses Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-gray-200">
            <tr class="text-left">
              <th class="pb-3 text-sm font-semibold text-gray-700">Date</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Category</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Description</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-right">Amount</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredExpenses.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">
                No expenses found
              </td>
            </tr>
            <tr
              v-for="expense in filteredExpenses"
              :key="expense.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="py-3 text-sm text-gray-600">
                {{ formatDate(expense.date) }}
              </td>
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-lg">
                    {{ expense.categoryIcon }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ expense.categoryName }}</div>
                    <div v-if="expense.subcategoryName" class="text-xs text-gray-500">
                      {{ expense.subcategoryName }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3 text-sm text-gray-900">
                {{ expense.description || '-' }}
              </td>
              <td class="py-3 text-sm font-semibold text-gray-900 text-right">
                {{ currencySymbol }}{{ expense.amount.toFixed(2) }}
              </td>
              <td class="py-3 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    @click="editExpense(expense)"
                    class="text-sky-600 hover:text-sky-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteExpense(expense)"
                    class="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content">
        <h3 class="text-lg font-semibold mb-4">
          {{ showEditModal ? 'Edit Expense' : 'Add Expense' }}
        </h3>

        <div class="space-y-4">
          <!-- Amount -->
          <div>
            <label class="input-label">Amount *</label>
            <input
              v-model="expenseForm.amount"
              type="number"
              step="0.01"
              class="input"
              placeholder="0.00"
            />
          </div>

          <!-- Date -->
          <div>
            <label class="input-label">Date *</label>
            <input
              v-model="expenseForm.date"
              type="date"
              class="input"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="input-label">Category *</label>
            <select v-model="expenseForm.categoryId" class="input" @change="onCategoryChange">
              <option value="">Select category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.icon }} {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Subcategory -->
          <div v-if="subcategories.length > 0">
            <label class="input-label">Subcategory</label>
            <select v-model="expenseForm.subcategoryId" class="input">
              <option value="">None</option>
              <option v-for="sub in subcategories" :key="sub.id" :value="sub.id">
                {{ sub.name }}
              </option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label class="input-label">Description</label>
            <input
              v-model="expenseForm.description"
              type="text"
              class="input"
              placeholder="Optional"
            />
          </div>
        </div>

        <div class="flex gap-2 mt-6">
          <button @click="saveExpense" class="flex-1 btn btn-primary">
            {{ showEditModal ? 'Update' : 'Add' }}
          </button>
          <button @click="closeModals" class="flex-1 btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content">
        <h3 class="text-lg font-semibold mb-4">Delete Expense</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this expense? This action cannot be undone.
        </p>
        <div class="flex gap-2">
          <button @click="confirmDelete" class="flex-1 btn btn-danger">
            Delete
          </button>
          <button @click="showDeleteModal = false" class="flex-1 btn btn-secondary">
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

const expensesStore = useExpensesStore();
const categoriesStore = useCategoriesStore();
const settingsStore = useSettingsStore();

// Data
const filters = ref({
  search: '',
  dateFrom: '',
  dateTo: '',
  categoryId: '',
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const expenseForm = ref({
  id: null as number | null,
  amount: '',
  date: new Date().toISOString().split('T')[0],
  categoryId: '',
  subcategoryId: '',
  description: '',
});

const expenseToDelete = ref<any>(null);

// Computed
const currencySymbol = computed(() => settingsStore.currencySymbol || '$');
const categories = computed(() => categoriesStore.categories);

const subcategories = computed(() => {
  if (!expenseForm.value.categoryId) return [];
  const category = categories.value.find(c => c.id === Number(expenseForm.value.categoryId));
  return category?.subcategories || [];
});

const filteredExpenses = computed(() => {
  let result = [...expensesStore.expenses];

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(exp =>
      exp.description?.toLowerCase().includes(search)
    );
  }

  // Date from filter
  if (filters.value.dateFrom) {
    result = result.filter(exp => exp.date >= filters.value.dateFrom);
  }

  // Date to filter
  if (filters.value.dateTo) {
    result = result.filter(exp => exp.date <= filters.value.dateTo);
  }

  // Category filter
  if (filters.value.categoryId) {
    result = result.filter(exp => exp.categoryId === Number(filters.value.categoryId));
  }

  // Sort by date (newest first)
  return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// Load data
onMounted(async () => {
  await Promise.all([
    expensesStore.fetchExpenses(),
    categoriesStore.fetchCategories(),
    settingsStore.fetchSettings(),
  ]);
});

// Methods
function clearFilters() {
  filters.value = {
    search: '',
    dateFrom: '',
    dateTo: '',
    categoryId: '',
  };
}

function onCategoryChange() {
  expenseForm.value.subcategoryId = '';
}

function editExpense(expense: any) {
  expenseForm.value = {
    id: expense.id,
    amount: expense.amount.toString(),
    date: expense.date,
    categoryId: expense.categoryId.toString(),
    subcategoryId: expense.subcategoryId?.toString() || '',
    description: expense.description || '',
  };
  showEditModal.value = true;
}

function deleteExpense(expense: any) {
  expenseToDelete.value = expense;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!expenseToDelete.value) return;

  try {
    await expensesStore.deleteExpense(expenseToDelete.value.id);
    showDeleteModal.value = false;
    expenseToDelete.value = null;
  } catch (error) {
    alert('Failed to delete expense');
  }
}

async function saveExpense() {
  if (!expenseForm.value.amount || !expenseForm.value.categoryId) {
    alert('Please fill in amount and category');
    return;
  }

  try {
    const data = {
      amount: Number(expenseForm.value.amount),
      date: expenseForm.value.date,
      categoryId: Number(expenseForm.value.categoryId),
      subcategoryId: expenseForm.value.subcategoryId ? Number(expenseForm.value.subcategoryId) : undefined,
      description: expenseForm.value.description || undefined,
    };

    if (showEditModal.value && expenseForm.value.id) {
      await expensesStore.updateExpense(expenseForm.value.id, data);
    } else {
      await expensesStore.createExpense(data);
    }

    closeModals();
  } catch (error) {
    alert('Failed to save expense');
  }
}

function closeModals() {
  showAddModal.value = false;
  showEditModal.value = false;
  expenseForm.value = {
    id: null,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    subcategoryId: '',
    description: '',
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
</script>
