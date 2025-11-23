# ✅ Render Environment Variables - Complete List

## 🔧 Copy these to your Render Dashboard

Go to: **Render Dashboard → Your Service → Environment → Add Environment Variable**

---

## Required Variables:

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_kiW9HBJe0Xfw@ep-wispy-dust-adzncwlu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# BitQuery API Keys (All 4 keys for rotation)
BITQUERY_API_KEY_1=ory_at_lOVqx_pZ5gRRH_pRdxHiyaASakBERKCxnjxmE9nmvIE.mOI084SbLYFaBmwgFASPO0sggBTZI063fDfOTGYm0qU
BITQUERY_API_KEY_2=ory_at_ZxirfqGZJw2yRWTsaNcwOlEHFwYGdsatSy2QPgJoqWU.QRw45WPyEZZITOpFYPx7trnejkIc4Ds9xrco0YgUGmE
BITQUERY_API_KEY_3=ory_at_eAr-OzxUy8QHNMvvcJ0QeExSB7HehXgkl0WwBU8KfJg.JW11SFPrnW49GZ4z3vIqU31R52z-fSgImZMoOqAZB6I
BITQUERY_API_KEY_4=YOUR_FOURTH_KEY_HERE

# JWT Secret
JWT_SECRET=qwery-super-secret-jwt-key-change-this-in-production-min-32-chars

# Server Configuration
NODE_ENV=production
PORT=10000

# CORS Origins (Update with your Vercel URL after frontend deployment)
CORS_ORIGINS=http://localhost:3001,https://your-frontend.vercel.app

# Rate Limiting (Optional - defaults are set)
API_RATE_LIMIT_WINDOW=15
API_RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📝 Important Notes:

1. **BITQUERY_API_KEY_4** - Replace `YOUR_FOURTH_KEY_HERE` with your actual 4th BitQuery API key from your `.env` file

2. **DATABASE_URL** - Make sure it includes `?sslmode=require&channel_binding=require` at the end

3. **PORT** - Render typically uses port 10000, not 3000

4. **CORS_ORIGINS** - Add your Vercel frontend URL after deploying frontend (comma-separated, no spaces)

---

## ✅ After Adding Variables:

1. Click **"Save Changes"** in Render
2. Render will automatically **redeploy** your service
3. Check the **"Logs"** tab to verify deployment success
4. Look for: `Server running on port 10000` and `Database connected successfully`

---

## 🧪 Test Your Deployment:

```bash
# Health check
curl https://your-render-url.onrender.com/health

# Should return:
# {"status":"ok","timestamp":"..."}
```

---

**✅ All 4 BitQuery API keys are now supported for higher rate limits and automatic rotation!**
