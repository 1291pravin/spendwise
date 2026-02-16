# Implementation Notes

## Technical Details

### Framework & Tools
- **Nuxt 4.3.1** with Vue 3.5.28
- **Tailwind CSS v4** (via Vite plugin)
- **Pinia** for state management
- **NuxtHub** for database and cache
- **nuxt-auth-utils** for authentication

### Color System
The Electron app uses sky blue as primary color. Tailwind v4 includes the full color palette by default, so no configuration needed:
- `sky-50` through `sky-950` available
- Primary: `sky-500` (#0ea5e9)
- Hover: `sky-600` (#0284c7)
- Light backgrounds: `sky-50`, `sky-100`

### CSS Architecture

#### Custom Classes (in main.css)
All custom classes use Tailwind's `@apply` directive for consistency:

**Cards**
```css
.card { @apply bg-white rounded-lg shadow-sm border border-gray-200 p-4; }
.card-header { @apply text-lg font-semibold text-gray-900 mb-4; }
```

**Buttons**
```css
.btn { @apply px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2; }
.btn-primary { @apply bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500; }
.btn-secondary { @apply bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500; }
.btn-danger { @apply bg-red-500 text-white hover:bg-red-600 focus:ring-red-500; }
```

**Inputs**
```css
.input-label { @apply block text-sm font-medium text-gray-700 mb-1; }
.input { @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent; }
```

### Component Composition

#### AppLayout.vue
Wrapper component that provides the two-column layout:
- Fixed sidebar (256px)
- Flexible main content (ml-64 to offset sidebar)
- 32px padding on main (p-8)

Used in all authenticated pages except login.

#### Sidebar.vue
Navigation component with:
- Logo area (p-6, border-b)
- Nav items (p-4, space-y-1)
- User section (p-4, border-t)
- Active state: `nav-item-active` class

### Page Structure

All authenticated pages follow this pattern:
```vue
<template>
  <AppLayout>
    <!-- Page Title -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Title</h1>
      <p class="text-sm text-gray-500">Subtitle</p>
    </div>

    <!-- Content Cards -->
    <div class="card">
      <!-- Card content -->
    </div>
  </AppLayout>
</template>
```

### State Management

#### Stores Used
1. **expensesStore**: CRUD for expenses
2. **categoriesStore**: CRUD for categories and subcategories
3. **settingsStore**: User preferences
4. **authStore**: Authentication (logout only)

#### Store Methods Added
```typescript
// categoriesStore
updateCategory(id, data)
deleteCategory(id)
deleteSubcategory(categoryId, subcategoryId)
// Updated createSubcategory signature
```

### Modal Pattern

All modals follow this structure:
```vue
<div v-if="showModal" class="modal-overlay" @click.self="closeModal">
  <div class="modal-content">
    <h3 class="text-lg font-semibold mb-4">Title</h3>
    <!-- Content -->
    <div class="flex gap-2 mt-6">
      <button class="flex-1 btn btn-primary">Action</button>
      <button class="flex-1 btn btn-secondary">Cancel</button>
    </div>
  </div>
</div>
```

Key features:
- Click outside to close (`@click.self`)
- Consistent header spacing
- Flex buttons with gap
- Uses custom modal classes

### Data Flow

#### Dashboard
1. Load expenses, categories, settings on mount
2. Filter expenses by current month
3. Compute:
   - Month summary (total, count)
   - Budget percentage and status
   - Category breakdown
   - Recent transactions
4. Month navigation updates `currentMonth` ref
5. All computeds auto-recalculate

#### Expenses
1. Load expenses, categories on mount
2. Apply filters reactively via computed
3. Subcategories loaded when category selected
4. CRUD operations update store
5. Store automatically refreshes list

#### Categories
1. Load categories on mount (includes subcategories)
2. Icon/color pickers use predefined arrays
3. Subcategory operations refresh categories
4. Default categories can't be deleted

### Filtering Logic

Expenses page supports 4 filters:
```typescript
const filteredExpenses = computed(() => {
  let result = [...expensesStore.expenses];

  // Search filter (description)
  if (filters.value.search) {
    result = result.filter(exp =>
      exp.description?.toLowerCase().includes(search)
    );
  }

  // Date range filters
  if (filters.value.dateFrom) {
    result = result.filter(exp => exp.date >= dateFrom);
  }
  if (filters.value.dateTo) {
    result = result.filter(exp => exp.date <= dateTo);
  }

  // Category filter
  if (filters.value.categoryId) {
    result = result.filter(exp => exp.categoryId === id);
  }

  // Sort by date (newest first)
  return result.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});
```

### Budget Status Logic

Color-coded based on percentage used:
```typescript
const budgetPercentage = computed(() => {
  if (!monthlyBudget.value) return 0;
  return Math.min((total / monthlyBudget.value) * 100, 100);
});

const budgetStatusClass = computed(() => {
  if (!monthlyBudget.value) return 'text-gray-900';
  const p = budgetPercentage.value;
  if (p >= 100) return 'text-red-500';    // Over budget
  if (p >= 80) return 'text-yellow-500';  // Warning
  return 'text-green-500';                // Safe
});

const budgetBarClass = computed(() => {
  const p = budgetPercentage.value;
  if (p >= 100) return 'bg-red-500';
  if (p >= 80) return 'bg-yellow-500';
  return 'bg-green-500';
});
```

### Icon & Color Pickers

#### Icons (Categories)
20 emoji options in 10-column grid:
```typescript
const availableIcons = [
  '🍔', '🚗', '🏠', '⚡', '🎮', '🎬', '🛒', '✈️', '🏥', '💊',
  '🎓', '📚', '💼', '👔', '🎨', '🏋️', '☕', '🍕', '🎵', '🐕',
];
```

#### Colors (Categories)
15 color swatches in 5-column grid:
```typescript
const availableColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
];
```

Selection feedback:
- Icons: `bg-sky-100 ring-2 ring-sky-500`
- Colors: `ring-4 ring-gray-300`

### Responsive Design

Layout breakpoints:
- Sidebar: Always visible (fixed 256px)
- Content: `ml-64` to account for sidebar
- Cards: Use Tailwind responsive classes
- Grids: `grid-cols-1 md:grid-cols-3` for summary cards

For mobile optimization (future):
- Hide sidebar by default
- Show hamburger menu
- Sidebar as overlay drawer

### Performance Considerations

1. **Computed Properties**: All filtered/derived data uses computed
2. **List Rendering**: `v-for` with `:key="id"` for efficient updates
3. **Store Updates**: Direct array mutations for instant UI updates
4. **API Calls**: Async/await with proper error handling
5. **Loading States**: Show while fetching data

### Accessibility

1. **Focus States**: All interactive elements have focus rings
2. **Labels**: All inputs have associated labels
3. **Keyboard**: Enter key works in forms
4. **Colors**: Sufficient contrast for text
5. **Semantic HTML**: Proper button/link usage

### Security

1. **Authentication**: All pages use `auth` middleware
2. **API Routes**: Protected by session
3. **CSRF**: Handled by nuxt-auth-utils
4. **Input Validation**: Required fields enforced
5. **SQL Injection**: Prevented by Drizzle ORM

### Future Enhancements

1. **Mobile Responsive**: Collapsible sidebar for small screens
2. **Dark Mode**: Add dark color scheme
3. **Keyboard Shortcuts**: Add quick actions
4. **Export**: CSV/PDF export of expenses
5. **Charts**: Add chart library for visualizations
6. **Notifications**: Toast messages instead of alerts
7. **Drag & Drop**: Reorder categories
8. **Bulk Actions**: Select multiple expenses
9. **Search**: Global search across all data
10. **Filters**: Save filter presets

### Known Issues

1. **Alerts**: Using native `alert()` - should use toast library
2. **Confirmations**: Using native `confirm()` - should use modal
3. **Date Handling**: No timezone support
4. **Large Datasets**: No pagination on dashboard
5. **Error Messages**: Generic error text

### Testing Recommendations

#### Unit Tests
- Store actions and mutations
- Computed properties logic
- Date filtering functions
- Budget calculation logic

#### Integration Tests
- Form submissions
- Modal interactions
- Filter combinations
- Navigation flow

#### E2E Tests
- Complete user journeys
- CRUD operations
- Authentication flow
- Data persistence

### Deployment Notes

1. **Environment Variables**: Ensure Google OAuth configured
2. **Database**: SQLite auto-created by NuxtHub
3. **Build**: `npm run build`
4. **Deploy**: Compatible with any Nuxt-compatible host
5. **Migrations**: Run seed script for default categories

### Maintenance

#### Adding New Features
1. Follow existing component patterns
2. Use custom CSS classes
3. Maintain color scheme
4. Add to appropriate store
5. Update documentation

#### Modifying Styles
1. Update `main.css` for global changes
2. Use Tailwind utilities for component-specific
3. Maintain 200ms transition duration
4. Test dark backgrounds for contrast

#### Adding Pages
1. Create in `pages/` directory
2. Wrap with `AppLayout`
3. Add to Sidebar navigation
4. Follow title/subtitle pattern
5. Use card-based layout
