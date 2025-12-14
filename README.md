# Tamoray AI - YouTube Thumbnail Generator

AI-powered YouTube thumbnail generation with Flux Schnell and intelligent planning.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon, Supabase, or local)
- Redis instance (Upstash or local)
- Cloudinary account
- Replicate API account
- Clerk account for authentication

### Environment Variables

Create a `.env` file with the following:

```env
# Database
DATABASE_URL="postgresql://..."

# Redis (Upstash)
REDIS_HOST="your-redis-host.upstash.io"
REDIS_PORT="6379"
REDIS_PASSWORD="your-redis-password"
REDIS_USERNAME="default"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Replicate
REPLICATE_API_TOKEN="r8_..."

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# OpenAI (for planning)
OPENAI_API_KEY="sk-..."
```

### Installation

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## 🏗️ Architecture

### Job Processing Pipeline

1. **Frontend** → POST `/api/generate` with prompt
2. **API Route** → Creates job in DB, queues in Redis
3. **Worker** → Processes job (triggered by cron or manual)
4. **Replicate** → Generates image with Flux Schnell
5. **Cloudinary** → Uploads and optimizes image
6. **Database** → Stores final result
7. **Frontend** → Polls `/api/job-status/[jobId]` for updates

### Key Endpoints

- `POST /api/generate` - Queue new generation job
- `GET /api/job-status/[jobId]` - Check job status
- `GET /api/worker` - Process queued jobs (auto-triggered by cron)
- `GET /api/debug` - Test all service connections
- `POST /api/plan` - Get AI planning suggestions

## 🔧 Development

### Testing the Pipeline

1. **Check services**: Visit `/api/debug` to verify all connections
2. **Generate image**: Use the dashboard to create a thumbnail
3. **Trigger worker**: Visit `/api/worker` to manually process jobs
4. **Check logs**: Monitor console for detailed logging

### Manual Worker Trigger

In development, the worker runs via cron every minute. To manually trigger:

```bash
curl http://localhost:3000/api/worker
```

### Database Schema

```bash
npx prisma studio  # Visual database browser
npx prisma db push # Push schema changes
```

## 📝 Logging

All components include comprehensive emoji-based logging:

- 🚀 Starting operations
- ✅ Success
- ❌ Errors
- 📊 Status checks
- 💾 Database operations
- 🔌 Connection events
- 🤖 AI operations

## 🐛 Troubleshooting

### "Unexpected token '<'" Error

This means the API is returning HTML instead of JSON. Check:
1. Visit `/api/debug` to verify all services are connected
2. Check browser console for actual error
3. Verify environment variables are set correctly

### Jobs Not Processing

1. Check `/api/worker` returns success
2. Verify Redis connection in `/api/debug`
3. Check Replicate API token is valid
4. Monitor server logs for errors

### Images Not Uploading

1. Verify Cloudinary credentials in `/api/debug`
2. Check Cloudinary dashboard for quota
3. Ensure image URLs from Replicate are accessible

## 🚀 Deployment

### Vercel Deployment

```bash
vercel
```

The `vercel.json` configures automatic worker execution every minute.

### Environment Variables

Add all `.env` variables to Vercel project settings.

### Post-Deployment

1. Run database migrations: `npx prisma db push`
2. Test `/api/debug` endpoint
3. Manually trigger `/api/worker` once
4. Monitor Vercel logs for cron execution

## 📚 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma
- **Queue**: Redis
- **Auth**: Clerk
- **AI**: Replicate (Flux Schnell), OpenAI (Planning)
- **Storage**: Cloudinary
- **Deployment**: Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
