<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="text-center max-w-2xl px-6">
      <h1 class="text-5xl font-bold text-gray-900 mb-4">
        💰 Expense Tracker
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        Track your expenses and manage your budget with ease
      </p>

      <div class="bg-white rounded-lg shadow-xl p-8 mb-6">
        <h2 class="text-2xl font-semibold mb-4">Features</h2>
        <ul class="text-left space-y-2 text-gray-700">
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            Track expenses by category
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            Set monthly budgets
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            View spending reports
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            Secure Google login
          </li>
        </ul>
      </div>

      <div class="space-y-4">
        <a
          href="/auth/google"
          class="w-full bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </a>

        <p class="text-sm text-gray-500">
          Secure authentication with your Google account
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Welcome',
});
</script>
