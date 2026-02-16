# ELECTRON FEATURES AND UI DOCUMENTATION

## Overview
Personal expense tracker Electron application with Vue 3, Tailwind CSS, and SQLite backend. Features local-first data storage with optional Google Drive sync capability. Current version: 0.1.0

---

## UI/UX Analysis

### Overall Design Philosophy
- **Style**: Modern, clean, minimalist interface with focus on data clarity
- **Framework**: Tailwind CSS with custom component classes
- **Color Scheme**:
  - Primary: Sky blue (`#0ea5e9`) - used for active states, buttons, highlights
  - Secondary: Gray palette (`#f9fafb` to `#1f2937`) - backgrounds and text
  - Accent Colors: Green (success), Yellow (warning), Red (danger)
  - Background: Light gray (`#f3f4f6`)

### Layout Structure
- **Two-column layout**:
  - Left Sidebar (fixed, 256px width): Navigation and sync status
  - Main Content Area (flex-1): Page-specific content with 32px padding
- **Sidebar Components**:
  - Logo area with icon and app name
  - Main navigation (4 items: Dashboard, Expenses, Categories, Settings)
  - Sync status indicator (bottom, colored dot + text)
- **Responsive**: Adapts to smaller screens with grid layouts

### Typography & Spacing
- **Font Stack**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Font Sizes**:
  - Page title: 1.5rem (24px), bold
  - Section subtitle: 0.875rem (14px), gray-500
  - Card headers: 1.125rem (18px), semibold
  - Form labels: 0.875rem (14px), medium, gray-700
  - Body text: 0.875-1rem depending on context
- **Spacing**: Based on Tailwind scale (p-4, p-6, p-8 = 16px, 24px, 32px)
- **Line heights**: Comfortable spacing for readability

### Component Patterns

#### Cards
- Class: `card` (white background, light border, rounded shadow)
- Used for: Content grouping, forms, data displays
- Styles: `bg-white rounded-lg shadow-sm border border-gray-200 p-4`

#### Buttons
- **Primary** (`.btn-primary`): Blue background, white text, hover darkens
- **Secondary** (`.btn-secondary`): Light gray background, hover darkens
- **Danger** (`.btn-danger`): Red background (used for delete actions)
- Styling: Rounded corners, focus ring, smooth transitions
- Sizes: Standard height (32px), flexible width (px-4)

#### Color System
**Primary Colors** (Sky Blue)
- 50: `#f0f9ff`
- 100: `#e0f2fe`
- 500: `#0ea5e9` (primary)
- 600: `#0284c7` (hover)

**Status Colors**
- Green: `#22c55e` (success, budget OK)
- Yellow: `#eab308` (warning, budget tight)
- Red: `#ef4444` (danger, budget critical)

---

## Feature List

### 1. DASHBOARD (Home View)
- Monthly/Cycle Summary with stats
- Month Navigation with arrows
- Budget Tracking with color-coded progress
- Category Breakdown with bar charts
- Recent Transactions list

### 2. EXPENSES VIEW
- Expense List with pagination
- Advanced Filtering (search, date range, category)
- CRUD Operations with modals
- Subcategory Support

### 3. CATEGORIES VIEW
- Category Management (add/edit/delete)
- Subcategory Management
- Icon picker (20 emoji options)
- Color picker (15 color options)

### 4. SETTINGS VIEW
- Budget Configuration
- Billing Cycle (1-28 days)
- Currency Selection (10 options)
- About Section

---

See full documentation for complete details on components, styling, and implementation.
