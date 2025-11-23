# ✅ Complete Render Environment Variables Setup

## 🎯 Copy ALL These Variables to Render Dashboard

**Go to:** Render Dashboard → Your Service → Environment Tab → Add Environment Variables

---

## 📋 Required Environment Variables (Copy All):

```bash
# ============================================
# Server Configuration
# ============================================
PORT=10000
NODE_ENV=production

# ============================================
# BitQuery API Keys (All 4 for rotation)
# ============================================
BITQUERY_API_KEY_1=ory_at_lOVqx_pZ5gRRH_pRdxHiyaASakBERKCxnjxmE9nmvIE.mOI084SbLYFaBmwgFASPO0sggBTZI063fDfOTGYm0qU
BITQUERY_API_KEY_2=ory_at_ZxirfqGZJw2yRWTsaNcwOlEHFwYGdsatSy2QPgJoqWU.QRw45WPyEZZITOpFYPx7trnejkIc4Ds9xrco0YgUGmE
BITQUERY_API_KEY_3=ory_at_eAr-OzxUy8QHNMvvcJ0QeExSB7HehXgkl0WwBU8KfJg.JW11SFPrnW49GZ4z3vIqU31R52z-fSgImZMoOqAZB6I
BITQUERY_API_KEY=ory_at_-4kS9Q2_TTcOW1kAe9a3Scbq4ibjB8lUY0P3hKvG-Fg.X1UapmTdOe9RL4O4mCiv5VTMBzzSvWlUZEIYcOUYLL0

# BitQuery Configuration
BITQUERY_ENDPOINT=https://streaming.bitquery.io/graphql

# ============================================
# Database (NeonDB PostgreSQL)
# ============================================
DATABASE_URL=postgresql://neondb_owner:npg_kiW9HBJe0Xfw@ep-wispy-dust-adzncwlu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# ============================================
# JWT Secret for Authentication
# ============================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456

# ============================================
# API Key Configuration
# ============================================
API_KEY_PREFIX=qwery_live_

# ============================================
# CORS Origins (IMPORTANT!)
# ============================================
CORS_ORIGINS=http://localhost:3001,https://your-frontend.vercel.app

# ============================================
# Rate Limiting Configuration
# ============================================
API_RATE_LIMIT_WINDOW=15
API_RATE_LIMIT_MAX_REQUESTS=100
```

---

## ⚠️ IMPORTANT: Update These After Frontend Deployment

Once you deploy your frontend to Vercel, update:

```bash
CORS_ORIGINS=http://localhost:3001,https://qwery.vercel.app
```

Replace `https://qwery.vercel.app` with your actual Vercel URL.

---

## 🔧 Build & Start Commands

**Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

**Start Command:**
```bash
node index.js
```

---

## ✅ What Each Variable Does:

| Variable | Purpose | Required |
|----------|---------|----------|
| `PORT` | Server port (Render uses 10000) | ✅ Yes |
| `NODE_ENV` | Environment mode (production/development) | ✅ Yes |
| `BITQUERY_API_KEY_1-3` | BitQuery API keys for rotation | ✅ Yes |
| `BITQUERY_API_KEY` | Single fallback key | ✅ Yes |
| `BITQUERY_ENDPOINT` | BitQuery GraphQL endpoint | ✅ Yes |
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `JWT_SECRET` | Secret for JWT token signing | ✅ Yes |
| `API_KEY_PREFIX` | Prefix for generated API keys | ✅ Yes |
| `CORS_ORIGINS` | Allowed frontend origins | ✅ Yes |
| `API_RATE_LIMIT_WINDOW` | Rate limit window (minutes) | No |
| `API_RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No |

---

## 🚀 Deployment Steps:

1. **Go to Render Dashboard**
2. **Select your service**
3. **Click "Environment" tab**
4. **Click "Add Environment Variable"**
5. **Copy-paste each variable** (name and value)
6. **Click "Save Changes"**
7. **Wait for auto-redeploy** (3-5 minutes)

---

## 📊 Expected Log Output After Successful Deploy:

```bash
[dotenv@17.2.3] injecting env (15) from .env
Initializing Bitquery client with key index: 0
✅ Loaded 4 BitQuery API keys
✅ Database connected successfully
✅ CORS origins configured: http://localhost:3001, https://your-frontend.vercel.app
✅ Rate limiting: 100 requests per 15 minutes
✅ Server running on port 10000
```

---

## 🧪 Test Your Deployment:

```bash
# Health check
curl https://your-app.onrender.com/health

# Expected response:
# {"status":"ok","timestamp":"2025-11-23T..."}
```

---

## 🐛 Common Issues & Solutions:

### Issue 1: "Cannot read properties of undefined"
**Solution:** Make sure ALL environment variables are added to Render, not just some.

### Issue 2: "Missing required environment variables"
**Solution:** Check that DATABASE_URL and at least one BITQUERY_API_KEY is set.

### Issue 3: CORS errors in browser
**Solution:** Update CORS_ORIGINS to include your Vercel frontend URL (no trailing slash).

### Issue 4: Database connection fails
**Solution:** Verify DATABASE_URL includes `?sslmode=require&channel_binding=require` at the end.

---

## 📝 Checklist Before Deploying:

- [ ] All environment variables copied to Render
- [ ] Build command set: `npm install && npx prisma generate && npx prisma migrate deploy`
- [ ] Start command set: `node index.js`
- [ ] Database URL is correct with SSL parameters
- [ ] All 4 BitQuery API keys are added
- [ ] CORS_ORIGINS includes localhost for testing
- [ ] Code is pushed to GitHub main branch

---

**✅ Once all variables are set, Render will automatically redeploy and your API will be live!** 🚀
