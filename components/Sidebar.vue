<template>
  <aside class="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col">
    <!-- Logo Area -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center gap-2">
        <span class="text-2xl">💰</span>
        <span class="text-lg font-semibold text-gray-900">Expense Tracker</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1">
      <NuxtLink
        to="/dashboard"
        class="nav-item"
        :class="{ 'nav-item-active': isActive('/dashboard') }"
      >
        <span class="text-xl">📊</span>
        <span>Dashboard</span>
      </NuxtLink>

      <NuxtLink
        to="/expenses"
        class="nav-item"
        :class="{ 'nav-item-active': isActive('/expenses') }"
      >
        <span class="text-xl">💳</span>
        <span>Expenses</span>
      </NuxtLink>

      <NuxtLink
        to="/categories"
        class="nav-item"
        :class="{ 'nav-item-active': isActive('/categories') }"
      >
        <span class="text-xl">📁</span>
        <span>Categories</span>
      </NuxtLink>

      <NuxtLink
        to="/settings"
        class="nav-item"
        :class="{ 'nav-item-active': isActive('/settings') }"
      >
        <span class="text-xl">⚙️</span>
        <span>Settings</span>
      </NuxtLink>
    </nav>

    <!-- User Section -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-semibold text-sm">
            {{ userInitials }}
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-900">{{ userName }}</span>
            <button
              @click="handleLogout"
              class="text-xs text-red-600 hover:text-red-700 text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute();
const { user } = useUserSession();
const authStore = useAuthStore();

const userName = computed(() => user.value?.name || 'User');
const userInitials = computed(() => {
  const name = user.value?.name || 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

function isActive(path: string) {
  return route.path === path;
}

function handleLogout() {
  authStore.logout();
}
</script>
