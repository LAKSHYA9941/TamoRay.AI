# 🚀 Quick Start Guide - Local Development

## Step 1: Install Dependencies

```powershell
npm install
```

## Step 2: Check Environment Variables

```powershell
node scripts/check-env.js
```

This will tell you which environment variables are missing.

## Step 3: Set Up Your .env File

Make sure your `.env` file has all required variables:

```env
# Database (Get from Neon, Supabase, or use local PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database"

# Redis (Get from Upstash Free Tier or use local Redis)
REDIS_HOST="your-host.upstash.io"
REDIS_PORT="6379"
REDIS_PASSWORD="your-password"
REDIS_USERNAME="default"

# Cloudinary (Free tier available at cloudinary.com)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Replicate (Get from replicate.com/account/api-tokens)
REPLICATE_API_TOKEN="r8_..."

# Clerk (Get from clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# OpenAI (Get from platform.openai.com)
OPENAI_API_KEY="sk-..."
```

## Step 4: Set Up Database

```powershell
npx prisma generate
npx prisma db push
```

## Step 5: Start Development Server

```powershell
npm run dev
```

## Step 6: Verify Everything Works

1. **Open browser**: http://localhost:3000
2. **Check services**: http://localhost:3000/api/debug
3. **Sign in** with Clerk
4. **Generate a thumbnail**!

## 🎯 Testing the Full Pipeline

### Method 1: Automatic (Recommended for Production)
Just create a thumbnail - the cron will process it within 1 minute.

### Method 2: Manual (Better for Development)

1. **Create a job**: Use the dashboard to submit a prompt
2. **Trigger worker manually**: 
   - Open new tab: http://localhost:3000/api/worker
   - Or use PowerShell:
   ```powershell
   curl http://localhost:3000/api/worker
   ```
3. **Check status**: The dashboard will auto-update

## 🐛 Troubleshooting

### "Cannot find module" errors
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### Database connection issues
- Verify DATABASE_URL is correct
- Check if database is accessible
- Run: `npx prisma studio` to test connection

### Redis connection issues
- Verify Redis credentials
- Test with: http://localhost:3000/api/debug

### Jobs not processing
- Manually trigger: http://localhost:3000/api/worker
- Check logs in terminal for errors

## 📝 Development Workflow

1. Make changes to code
2. Save (hot reload will update)
3. Test in browser
4. Check terminal logs for backend
5. Check browser console for frontend

## 🎨 Generate Your First Thumbnail

1. Go to http://localhost:3000
2. Sign in with Clerk
3. Click "Dashboard"
4. Enter a prompt like: "Excited developer coding at night with neon lights"
5. Click "Generate"
6. Open http://localhost:3000/api/worker in new tab to process
7. Watch the progress bar!

## ✅ You're Ready!

Your local development environment is now set up. Happy coding! 🚀
