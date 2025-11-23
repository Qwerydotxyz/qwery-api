# Render Deployment Configuration

## ✅ Fixed Issues:
- Created `index.js` entry point
- Updated `package.json` start script to use `index.js`
- API URL now uses environment variables

---

## 🔧 Render Service Configuration

### Basic Settings:
- **Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

- **Start Command:**
```bash
node index.js
```

- **Environment:** Node

---

## 🔐 Environment Variables (Add these in Render Dashboard):

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_kiW9HBJe0Xfw@ep-wispy-dust-adzncwlu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# BitQuery API Keys
BITQUERY_API_KEY_1=ory_at_lOVqx_pZ5gRRH_pRdxHiyaASakBERKCxnjxmE9nmvIE.mOI084SbLYFaBmwgFASPO0sggBTZI063fDfOTGYm0qU
BITQUERY_API_KEY_2=ory_at_ZxirfqGZJw2yRWTsaNcwOlEHFwYGdsatSy2QPgJoqWU.QRw45WPyEZZITOpFYPx7trnejkIc4Ds9xrco0YgUGmE
BITQUERY_API_KEY_3=ory_at_eAr-OzxUy8QHNMvvcJ0QeExSB7HehXgkl0WwBU8KfJg.JW11SFPrnW49GZ4z3vIqU31R52z-fSgImZMoOqAZB6I

# JWT Secret
JWT_SECRET=qwery-super-secret-jwt-key-change-this-in-production-min-32-chars

# Server Configuration
NODE_ENV=production
PORT=10000

# CORS Origins (Update after Vercel deployment)
CORS_ORIGINS=http://localhost:3001,https://your-frontend.vercel.app
```

---

## 📝 Steps to Deploy on Render:

1. Go to https://render.com and login with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `Qwerydotxyz/qwery-api`
4. Configure:
   - **Name:** qwery-api
   - **Branch:** main
   - **Root Directory:** (leave empty)
   - **Runtime:** Node
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command:** `node index.js`
5. Add all environment variables listed above
6. Click "Create Web Service"
7. Wait for deployment (3-5 minutes)
8. Copy your Render URL (e.g., `https://qwery-api.onrender.com`)

---

## 🧪 Test Your Deployment:

```bash
# Health check
curl https://your-render-url.onrender.com/health

# Wallet auth
curl -X POST https://your-render-url.onrender.com/api/v1/auth/wallet \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "test123"}'
```

---

## 🎯 Next Steps:

1. ✅ Backend deployed on Render
2. Deploy frontend on Vercel
3. Update CORS_ORIGINS with Vercel URL
4. Update Privy dashboard with production URLs
5. Test end-to-end

---

## 🐛 Common Issues:

### Issue: "Cannot find module"
**Fixed!** ✅ Created `index.js` entry point

### Issue: Database connection fails
**Solution:** Verify DATABASE_URL is correct and includes `?sslmode=require`

### Issue: Build timeout
**Solution:** Use the build command with prisma commands included

### Issue: CORS errors
**Solution:** Update CORS_ORIGINS after deploying frontend

---

**All fixes have been pushed to GitHub! Render will auto-deploy on next push.** 🚀
