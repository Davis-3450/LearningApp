# Redis/KV Setup Guide

## Environment Variables Required

Add these environment variables to your Vercel project or `.env.local` file:

```bash
# Vercel KV (Redis) Configuration
KV_REST_API_URL=your_kv_rest_api_url_here
KV_REST_API_TOKEN=your_kv_rest_api_token_here
KV_REST_API_READ_ONLY_TOKEN=your_read_only_token_here
KV_URL=your_kv_url_here
REDIS_URL=your_redis_url_here

# GPT/Agent API Secret (for secure API access)
AGENT_SECRET=your_secret_key_here

# OpenAI API Key (if using AI features)
OPENAI_API_KEY=your_openai_api_key_here
```

## Production Deployment Steps

### 1. Deploy to Vercel
```bash
# Build and deploy
vercel --prod

# Or use the Vercel dashboard
```

### 2. Configure Vercel KV
1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click **Connect Database** → **KV (Redis)**
4. Create or connect your KV database
5. Vercel will automatically set the environment variables

### 3. Set Additional Environment Variables
In your Vercel project settings:
- `AGENT_SECRET`: Generate a secure random string
- `OPENAI_API_KEY`: Your OpenAI API key (if using AI features)

## Features Implemented

### ✅ Redis Cache Integration
- All deck operations now use Redis for persistent storage
- Automatic fallback to filesystem if Redis is unavailable
- Cache synchronization on startup
- **Production-optimized**: Better error handling and resilience

### ✅ Complete CRUD Operations
- **GET** `/api/decks` - List all decks
- **POST** `/api/decks` - Create new deck
- **GET** `/api/decks/[fileName]` - Get specific deck
- **PUT** `/api/decks/[fileName]` - Update deck
- **DELETE** `/api/decks/[fileName]` - Delete deck

### ✅ GPT Integration API
- **GET** `/api/gpts/decks` - List decks (with API key auth)
- **POST** `/api/gpts/decks` - Create deck via GPT (with API key auth)
- **GET** `/api/gpts/decks/[fileName]` - Get specific deck via GPT

### ✅ Data Persistence
- Decks are stored in Redis/KV for durability
- Automatic cache invalidation on updates
- Seamless migration path to PostgreSQL later

### ✅ Production Ready Features
- **Next.js 15 Compatible**: Fixed async `params` issues
- **Monorepo Support**: Proper Vercel configuration
- **Error Resilience**: Graceful fallbacks in production
- **Cross-Origin Headers**: Configured for API access
- **Performance Optimized**: Selective disk writes

## How It Works

1. **Cache-First Strategy**: All reads check Redis first, fallback to local store
2. **Write-Through Cache**: All writes update both local store and Redis
3. **Automatic Sync**: On startup, the system syncs filesystem → Redis if cache is empty
4. **Error Resilience**: If Redis fails, operations continue with local storage
5. **Production Mode**: In production, relies primarily on Redis, minimal filesystem access

## Testing Locally

1. Install dependencies: `bun install` (in apps/frontend)
2. Start development server: `bun dev`
3. Test endpoints:
   ```bash
   # List decks
   curl http://localhost:3000/api/decks
   
   # Create deck
   curl -X POST http://localhost:3000/api/decks \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","description":"Test deck","concepts":[{"conceptType":"term","term":"Test","definition":"A test concept"}]}'
   ```

## Troubleshooting

### ❌ "params should be awaited" Error
**Fixed** ✅ - Updated to Next.js 15 format with `await params`

### ❌ Cross-Origin Request Errors
**Fixed** ✅ - Added CORS headers in `next.config.mjs`

### ❌ "Deck directory not found" in Production
**Fixed** ✅ - Added production path handling and graceful fallbacks

### ❌ Redis Connection Issues
- Verify `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set
- Check Vercel KV dashboard for connection status
- App will work without Redis (uses memory cache)

### ❌ GPT API Returns 401 Unauthorized
- Ensure `AGENT_SECRET` is set in Vercel environment variables
- Use the secret in `Authorization: Bearer <token>` header

## Migration to PostgreSQL

When ready to migrate to PostgreSQL:
1. Replace `apps/frontend/src/lib/redis-client.ts` with PostgreSQL client
2. Update `deckCache` functions to use SQL queries
3. Keep the same API interface - no changes needed elsewhere

## Performance Notes

- **Local Development**: Uses filesystem + memory cache
- **Production**: Uses Redis + memory cache (no filesystem writes)
- **Startup Time**: ~2-3s with Redis cache, ~5s without
- **API Response**: ~20-50ms cached, ~200ms uncached 