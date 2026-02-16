# Expense Tracker SaaS

A multi-user expense tracking application built with Nuxt 4, Vue 3, and Cloudflare D1.

## Features

- 🔐 Google OAuth authentication
- 💰 Personal expense tracking
- 📊 Monthly budget management
- 🏷️ Custom categories and subcategories
- 📱 Responsive mobile-first design
- ⚡ Edge deployment on Cloudflare

## Tech Stack

- **Framework:** Nuxt 4
- **UI:** Vue 3 + Tailwind CSS 4
- **Database:** Cloudflare D1 (SQLite)
- **ORM:** Drizzle ORM
- **Auth:** nuxt-auth-utils (Google OAuth)
- **State:** Pinia
- **Deployment:** NuxtHub + Cloudflare Pages

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

3. Setup Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/auth/google`
   - Copy Client ID and Client Secret to `.env`

4. Run database migrations:
```bash
npm run db:generate
npm run db:migrate
```

5. Start development server:
```bash
npm run dev
```

## Development

- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Database studio:** `npm run db:studio`

## Deployment

Deploy to Cloudflare Pages via NuxtHub:

1. Link project: `npx nuxthub link`
2. Deploy: `npx nuxthub deploy`

## License

MIT
