<template>
  <AppLayout>
    <!-- Page Title -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
      <p class="text-sm text-gray-500">Configure your preferences</p>
    </div>

    <!-- Budget Configuration -->
    <div class="card mb-6">
      <h3 class="card-header">Budget Configuration</h3>

      <div class="space-y-4">
        <!-- Monthly Budget -->
        <div>
          <label class="input-label">Monthly Budget</label>
          <input
            v-model="form.monthlyBudget"
            type="number"
            step="0.01"
            class="input"
            placeholder="Enter amount (optional)"
          />
          <p class="text-xs text-gray-500 mt-1">
            Set a monthly spending limit to track your budget
          </p>
        </div>

        <!-- Billing Cycle Start Day -->
        <div>
          <label class="input-label">Billing Cycle Start Day</label>
          <select v-model="form.billingCycleStartDay" class="input">
            <option v-for="day in 28" :key="day" :value="day">
              {{ day }}{{ getDaySuffix(day) }} of the month
            </option>
          </select>
          <p class="text-xs text-gray-500 mt-1">
            When your monthly budget period starts (1-28)
          </p>
        </div>

        <!-- Currency -->
        <div>
          <label class="input-label">Currency</label>
          <select v-model="form.currencySymbol" class="input">
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="¥">JPY (¥)</option>
            <option value="₹">INR (₹)</option>
            <option value="₽">RUB (₽)</option>
            <option value="R$">BRL (R$)</option>
            <option value="A$">AUD (A$)</option>
            <option value="C$">CAD (C$)</option>
            <option value="CHF">CHF (CHF)</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">
            Currency symbol to display
          </p>
        </div>

        <!-- Save Button -->
        <div class="pt-2">
          <button
            @click="saveSettings"
            :disabled="saving"
            class="btn btn-primary"
          >
            {{ saving ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </div>
    </div>

    <!-- About Section -->
    <div class="card">
      <h3 class="card-header">About</h3>
      <div class="space-y-2 text-sm text-gray-600">
        <p><strong>Expense Tracker</strong></p>
        <p>Version: 1.0.0</p>
        <p>A simple and efficient way to track your personal expenses.</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const settingsStore = useSettingsStore();

const form = ref({
  currencySymbol: '$',
  monthlyBudget: null as number | null,
  billingCycleStartDay: 1,
});

const saving = ref(false);

// Load settings on mount
onMounted(async () => {
  await settingsStore.fetchSettings();
  if (settingsStore.settings) {
    form.value = {
      currencySymbol: settingsStore.settings.currencySymbol || '$',
      monthlyBudget: settingsStore.settings.monthlyBudget,
      billingCycleStartDay: settingsStore.settings.billingCycleStartDay || 1,
    };
  }
});

async function saveSettings() {
  try {
    saving.value = true;
    await settingsStore.updateSettings(form.value);
    alert('Settings saved successfully!');
  } catch (error) {
    alert('Failed to save settings');
  } finally {
    saving.value = false;
  }
}

function getDaySuffix(day: number) {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
</script>
