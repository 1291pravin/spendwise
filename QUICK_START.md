# Quick Start Guide

## Development Server

```bash
npm run dev
```

Visit: http://localhost:3000 (or alternate port shown in console)

## First Time Setup

### 1. Authentication
- Click "Sign in with Google"
- Authorize the application
- You'll be redirected to the dashboard

### 2. Configure Settings
- Click "Settings" in the sidebar
- Set your monthly budget (optional)
- Choose billing cycle start day (1-28)
- Select your currency
- Click "Save Settings"

### 3. Add Categories (Optional)
Default categories are pre-loaded, but you can customize:
- Go to "Categories" page
- Click "+ Add Category"
- Choose a name, icon, and color
- Add subcategories if needed

### 4. Add Your First Expense
- Go to "Expenses" page
- Click "+ Add Expense"
- Fill in:
  - Amount (required)
  - Date (required)
  - Category (required)
  - Subcategory (optional)
  - Description (optional)
- Click "Add"

### 5. View Dashboard
- Return to "Dashboard"
- See your spending summary
- View category breakdown
- Check recent transactions
- Navigate between months with arrows

## Key Features

### Dashboard
- **Month Navigation**: Browse different months
- **Summary Cards**: Total spent, transaction count, budget status
- **Category Breakdown**: Visual breakdown with percentages
- **Recent Transactions**: Last 10 transactions

### Expenses
- **Filter**: By description, date range, category
- **Table View**: All expenses in sortable table
- **CRUD**: Add, edit, delete expenses
- **Subcategories**: Organize expenses further

### Categories
- **Manage**: Create, edit, delete categories
- **Customize**: Choose from 20 icons and 15 colors
- **Subcategories**: Add unlimited subcategories per category
- **Protection**: Default categories cannot be deleted

### Settings
- **Budget**: Set monthly spending limit
- **Billing Cycle**: Choose when your month starts (1-28)
- **Currency**: Select from 10 currencies

## Tips & Tricks

### Dashboard
- Use month arrows to review past spending
- Budget bar turns yellow at 80%, red at 100%
- Click category names to see all expenses in that category (future feature)

### Expenses
- Use date range filters for specific periods
- Search works on description text
- Edit inline by clicking "Edit"
- Delete requires confirmation

### Categories
- Choose contrasting colors for easy identification
- Use relevant icons for quick recognition
- Organize with subcategories for detailed tracking
- Can't delete categories with existing expenses (future protection)

### Settings
- Budget is optional but recommended for tracking
- Billing cycle useful if paid on specific day (e.g., 15th)
- Currency changes symbol display only (no conversion)

## Keyboard Shortcuts (Future)
- `N` - New expense
- `S` - Search/Filter
- `/` - Focus search
- `Esc` - Close modal

## Common Workflows

### Monthly Review
1. Go to Dashboard
2. Navigate to desired month
3. Review total spent vs budget
4. Check category breakdown
5. Identify top spending categories

### Add Multiple Expenses
1. Go to Expenses page
2. Click "+ Add Expense"
3. Fill form and click "Add"
4. Modal closes, repeat as needed

### Budget Tracking
1. Set budget in Settings
2. Dashboard shows progress bar
3. Green = safe, Yellow = warning, Red = over
4. "X left" or "X over" displayed

### Organize Categories
1. Go to Categories
2. Edit existing or add new
3. Add subcategories for detail
4. Choose colors for visual distinction

## Troubleshooting

### Can't Log In
- Ensure Google OAuth is configured in `.env`
- Check console for errors
- Try incognito mode

### Expenses Not Showing
- Check if filters are applied (clear them)
- Ensure you're in the right month on dashboard
- Refresh the page

### Budget Not Updating
- Go to Settings and verify budget is set
- Save settings if changed
- Refresh dashboard

### Categories Missing
- Default categories should auto-load
- Check browser console for errors
- Try clearing cache and reloading

## Data Management

### Export (Future Feature)
- Will support CSV export
- Filter → Export → Download

### Backup
- SQLite database in `.data/` directory
- Copy `hub.db` to backup
- Restore by replacing file

### Reset Data
- Delete `.data/hub.db`
- Restart server
- Default categories will be recreated

## API Endpoints

### Expenses
- `GET /api/expenses` - List all
- `POST /api/expenses` - Create
- `PATCH /api/expenses/:id` - Update
- `DELETE /api/expenses/:id` - Delete

### Categories
- `GET /api/categories` - List all (includes subcategories)
- `POST /api/categories` - Create
- `PATCH /api/categories/:id` - Update
- `DELETE /api/categories/:id` - Delete

### Subcategories
- `GET /api/subcategories` - List all
- `POST /api/subcategories` - Create
- `DELETE /api/subcategories/:id` - Delete

### Settings
- `GET /api/settings` - Get user settings
- `PATCH /api/settings` - Update settings

### Auth
- `GET /auth/google` - Google OAuth login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Current session

## Customization

### Change Primary Color
Edit `assets/css/main.css`:
```css
.btn-primary {
  @apply bg-purple-500 hover:bg-purple-600;
}
.nav-item-active {
  @apply bg-purple-50 text-purple-600;
}
```

### Add New Page
1. Create `pages/newpage.vue`
2. Add to `components/Sidebar.vue` navigation
3. Use `AppLayout` wrapper
4. Follow existing patterns

### Modify Categories
Edit `server/utils/seed.ts` for default categories

## Support

For issues or questions:
1. Check documentation files
2. Review console for errors
3. Check existing issues
4. Create new issue with details

## Next Steps

1. ✅ Add your expenses regularly
2. ✅ Review dashboard weekly
3. ✅ Adjust budget as needed
4. ✅ Organize with categories
5. ✅ Track spending trends
