<template>
  <AppLayout>
    <!-- Page Title -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-sm text-gray-500">Overview of your expenses</p>
    </div>

    <!-- Month Navigation -->
    <div class="flex items-center justify-between mb-6">
      <button @click="previousMonth" class="btn btn-secondary">
        ← Previous
      </button>
      <h2 class="text-lg font-semibold text-gray-900">
        {{ currentMonthDisplay }}
      </h2>
      <button @click="nextMonth" class="btn btn-secondary">
        Next →
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total Spent -->
      <div class="card">
        <div class="text-sm font-medium text-gray-500 mb-2">Total Spent</div>
        <div class="text-3xl font-bold text-gray-900">
          {{ currencySymbol }}{{ monthSummary.total.toFixed(2) }}
        </div>
      </div>

      <!-- Transactions -->
      <div class="card">
        <div class="text-sm font-medium text-gray-500 mb-2">Transactions</div>
        <div class="text-3xl font-bold text-gray-900">
          {{ monthSummary.count }}
        </div>
      </div>

      <!-- Budget Status -->
      <div class="card">
        <div class="text-sm font-medium text-gray-500 mb-2">Budget</div>
        <div class="text-3xl font-bold" :class="budgetStatusClass">
          {{ budgetDisplay }}
        </div>
        <div v-if="monthlyBudget" class="mt-2">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all duration-200"
              :class="budgetBarClass"
              :style="{ width: budgetPercentage + '%' }"
            ></div>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ budgetPercentage.toFixed(0) }}% used
          </div>
        </div>
      </div>
    </div>

    <!-- Category Breakdown -->
    <div class="card mb-8">
      <h3 class="card-header">Category Breakdown</h3>
      <div v-if="categoryBreakdown.length === 0" class="text-center text-gray-500 py-8">
        No expenses this month
      </div>
      <div v-else class="space-y-4">
        <div v-for="cat in categoryBreakdown" :key="cat.categoryId" class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ cat.icon }}</span>
              <span class="text-sm font-medium text-gray-900">{{ cat.name }}</span>
            </div>
            <div class="text-right">
              <span class="text-sm font-semibold text-gray-900">
                {{ currencySymbol }}{{ cat.total.toFixed(2) }}
              </span>
              <span class="text-xs text-gray-500 ml-2">
                ({{ cat.percentage.toFixed(1) }}%)
              </span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-sky-500 h-2 rounded-full transition-all duration-200"
              :style="{ width: cat.percentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="card">
      <h3 class="card-header">Recent Transactions</h3>
      <div v-if="recentExpenses.length === 0" class="text-center text-gray-500 py-8">
        No recent transactions
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="expense in recentExpenses"
          :key="expense.id"
          class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">{{ expense.categoryIcon }}</span>
            <div>
              <div class="text-sm font-medium text-gray-900">
                {{ expense.description || 'No description' }}
              </div>
              <div class="text-xs text-gray-500">
                {{ expense.categoryName }}
                <span v-if="expense.subcategoryName"> • {{ expense.subcategoryName }}</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-semibold text-gray-900">
              {{ currencySymbol }}{{ expense.amount.toFixed(2) }}
            </div>
            <div class="text-xs text-gray-500">
              {{ formatDate(expense.date) }}
            </div>
          </div>
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

// Current month navigation
const currentMonth = ref(new Date());

// Computed
const currencySymbol = computed(() => settingsStore.currencySymbol || '$');
const monthlyBudget = computed(() => settingsStore.monthlyBudget);

const currentMonthDisplay = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
});

// Filter expenses for current month
const monthExpenses = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();

  return expensesStore.expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
  });
});

// Month summary
const monthSummary = computed(() => {
  const total = monthExpenses.value.reduce((sum, exp) => sum + exp.amount, 0);
  return {
    total,
    count: monthExpenses.value.length,
  };
});

// Budget status
const budgetPercentage = computed(() => {
  if (!monthlyBudget.value) return 0;
  return Math.min((monthSummary.value.total / monthlyBudget.value) * 100, 100);
});

const budgetDisplay = computed(() => {
  if (!monthlyBudget.value) return 'Not set';
  const remaining = monthlyBudget.value - monthSummary.value.total;
  return `${currencySymbol.value}${Math.abs(remaining).toFixed(2)} ${remaining >= 0 ? 'left' : 'over'}`;
});

const budgetStatusClass = computed(() => {
  if (!monthlyBudget.value) return 'text-gray-900';
  const percentage = budgetPercentage.value;
  if (percentage >= 100) return 'text-red-500';
  if (percentage >= 80) return 'text-yellow-500';
  return 'text-green-500';
});

const budgetBarClass = computed(() => {
  const percentage = budgetPercentage.value;
  if (percentage >= 100) return 'bg-red-500';
  if (percentage >= 80) return 'bg-yellow-500';
  return 'bg-green-500';
});

// Category breakdown
const categoryBreakdown = computed(() => {
  const breakdown = new Map();

  monthExpenses.value.forEach(expense => {
    const key = expense.categoryId;
    if (!breakdown.has(key)) {
      breakdown.set(key, {
        categoryId: key,
        name: expense.categoryName,
        icon: expense.categoryIcon,
        total: 0,
        count: 0,
      });
    }
    const cat = breakdown.get(key);
    cat.total += expense.amount;
    cat.count++;
  });

  const result = Array.from(breakdown.values());
  const total = monthSummary.value.total;

  result.forEach(cat => {
    cat.percentage = total > 0 ? (cat.total / total) * 100 : 0;
  });

  return result.sort((a, b) => b.total - a.total);
});

// Recent transactions (last 10)
const recentExpenses = computed(() => {
  return [...monthExpenses.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
});

// Load data on mount
onMounted(async () => {
  await Promise.all([
    expensesStore.fetchExpenses(),
    categoriesStore.fetchCategories(),
    settingsStore.fetchSettings(),
  ]);
});

// Month navigation
function previousMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1);
}

function nextMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
</script>
