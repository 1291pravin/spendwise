# Deployment Guide - Expense Tracker SaaS

## Prerequisites

1. **Cloudflare Account** (free tier works)
2. **Google OAuth Credentials**
3. **NuxtHub Account** (connect via hub.nuxt.com)

## Step 1: Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen if needed
6. Application type: "Web application"
7. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/google`
   - Production: `https://yourdomain.com/auth/google`
8. Save Client ID and Client Secret

## Step 2: Local Testing

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Fill in `.env`:
```env
NUXT_OAUTH_GOOGLE_CLIENT_ID=your_client_id_here
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=your_client_secret_here
NUXT_SESSION_PASSWORD=your-32-character-minimum-secret-key
```

3. Install dependencies:
```bash
npm install
```

4. Run migrations:
```bash
npm run db:migrate
```

5. Start dev server:
```bash
npm run dev
```

6. Test at http://localhost:3000

## Step 3: Deploy to Cloudflare via NuxtHub

### Option A: Deploy via NuxtHub Dashboard (Recommended)

1. Go to [hub.nuxt.com](https://hub.nuxt.com/)
2. Sign in and click "New Project"
3. Connect your GitHub repository (push code first)
4. Configure:
   - **Framework**: Nuxt
   - **Build command**: `npm run build`
   - **Output directory**: `.output`
5. Add environment variables in NuxtHub:
   - `NUXT_OAUTH_GOOGLE_CLIENT_ID`
   - `NUXT_OAUTH_GOOGLE_CLIENT_SECRET`
   - `NUXT_SESSION_PASSWORD` (generate a new 32+ char secret)
   - `NUXT_PUBLIC_APP_URL` (your production URL)
6. Deploy!

### Option B: Deploy via CLI

1. Install NuxtHub CLI:
```bash
npm install -g nuxthub
```

2. Login:
```bash
npx nuxthub login
```

3. Link project:
```bash
npx nuxthub link
```

4. Deploy:
```bash
npx nuxthub deploy
```

5. Set environment variables:
```bash
npx nuxthub env set NUXT_OAUTH_GOOGLE_CLIENT_ID your_client_id
npx nuxthub env set NUXT_OAUTH_GOOGLE_CLIENT_SECRET your_secret
npx nuxthub env set NUXT_SESSION_PASSWORD your_32_char_secret
```

## Step 4: Post-Deployment

1. **Update Google OAuth redirect URI**:
   - Add your production URL: `https://yourdomain.com/auth/google`

2. **Test production**:
   - Visit your deployed URL
   - Test Google login
   - Create test expense
   - Verify multi-user isolation (create 2 accounts)

3. **Configure custom domain** (optional):
   - In NuxtHub dashboard: Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed
   - Update Google OAuth redirect URI

## Step 5: Database Management

### View Database
```bash
npx nuxthub db studio
```

### Create Migration
```bash
npm run db:generate
```

### Apply Migrations
```bash
npm run db:migrate
```

## Monitoring & Maintenance

### Check Logs
- NuxtHub Dashboard → Your Project → Logs

### Database Backups
- Cloudflare D1 automatically backs up data
- Export via NuxtHub dashboard if needed

### Scaling
- Cloudflare D1 free tier: 5GB storage, 5 million reads/day
- Cloudflare Pages: Unlimited requests on free tier
- Upgrade Cloudflare plan if needed

## Troubleshooting

### OAuth not working
- Verify redirect URIs match exactly (http vs https, trailing slash)
- Check CLIENT_ID and SECRET are correct
- Ensure SESSION_PASSWORD is 32+ characters

### Database errors
- Run migrations: `npm run db:migrate`
- Check D1 database exists in Cloudflare dashboard

### Build failures
- Check Node.js version (use v18+)
- Clear `.nuxt` and `node_modules`, reinstall
- Verify all environment variables are set

## Security Checklist

- ✅ Use HTTPS in production (automatic with Cloudflare)
- ✅ SESSION_PASSWORD is 32+ random characters
- ✅ OAuth secrets are kept secure
- ✅ CORS is configured properly (automatic)
- ✅ Database has proper indexes (done in schema)

## Support

For issues:
1. Check NuxtHub docs: https://hub.nuxt.com/docs
2. Check Nuxt docs: https://nuxt.com/docs
3. Check Cloudflare D1 docs: https://developers.cloudflare.com/d1/
