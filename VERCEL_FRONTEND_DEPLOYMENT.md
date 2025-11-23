# 🚀 Deploy Next.js Dashboard to Vercel

## 📋 Overview

Your project has 2 parts:
- **Backend API** → Deployed on Render ✅
- **Frontend Dashboard** → Deploy on Vercel (this guide)

Both are in the same GitHub repo, so we'll configure Vercel to only deploy the `dashboard-nextjs/` folder.

---

## ⚡ Quick Deploy Steps

### 1️⃣ Go to Vercel

Visit: [https://vercel.com](https://vercel.com)

**Sign up/Login with GitHub** (easiest option)

---

### 2️⃣ Import Your Repository

1. Click **"Add New Project"**
2. Click **"Import Git Repository"**
3. Search for: **`Qwerydotxyz/qwery-api`**
4. Click **"Import"**

---

### 3️⃣ Configure Project Settings

**IMPORTANT:** Configure these settings before deploying:

```
Framework Preset: Next.js
Root Directory: dashboard-nextjs     ← Click "Edit" and set this!
Node Version: 20.x
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

**⚠️ Critical:** Make sure to set **Root Directory** to `dashboard-nextjs` so Vercel only deploys the frontend folder.

---

### 4️⃣ Add Environment Variables

Click **"Environment Variables"** and add these:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | `cm3q5qh2h0003sbnb18hux9gl` |
| `NEXT_PUBLIC_API_URL` | `https://your-render-url.onrender.com/api/v1/dashboard` |

**Replace** `your-render-url.onrender.com` with your actual Render URL!

**Example:** If your Render service is at `qwery-api-xyz.onrender.com`, use:
```
NEXT_PUBLIC_API_URL=https://qwery-api-xyz.onrender.com/api/v1/dashboard
```

---

### 5️⃣ Deploy!

Click **"Deploy"** button

Vercel will:
- Install dependencies
- Build your Next.js app
- Deploy to a `.vercel.app` URL
- Takes about 2-3 minutes ⏱️

---

## 📊 After Deployment

### Your Dashboard URL:
```
https://qwery-api.vercel.app
```
(or whatever custom domain Vercel assigns)

---

## 🔧 Update Backend CORS

**IMPORTANT:** After frontend deploys, update your Render backend:

1. Go to **Render Dashboard** → Your Service → **Environment**
2. Find `CORS_ORIGINS` variable
3. Update it to:
```
CORS_ORIGINS=http://localhost:3001,https://your-vercel-url.vercel.app
```

**Example:**
```
CORS_ORIGINS=http://localhost:3001,https://qwery-api.vercel.app
```

4. Save → Render will redeploy automatically

---

## 🔐 Update Privy Dashboard

Go to: [https://dashboard.privy.io](https://dashboard.privy.io)

1. Select your app: **`Qwery (cm3q5qh2h0003sbnb18hux9gl)`**
2. Go to **Settings** → **Allowed Domains**
3. Add your Vercel URL:
```
https://your-vercel-url.vercel.app
```
4. Save changes

---

## ✅ Test Your Deployment

1. **Visit your Vercel URL**
2. **Click "Connect Wallet"**
3. **Login with Phantom**
4. **Should see Dashboard/API Keys/Documentation pages**

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to load API"
**Solution:** Check `NEXT_PUBLIC_API_URL` is correct in Vercel environment variables.

### Issue 2: CORS errors in browser console
**Solution:** Update `CORS_ORIGINS` in Render to include your Vercel URL (no trailing slash).

### Issue 3: Privy wallet connection fails
**Solution:** Add your Vercel URL to Privy dashboard's allowed domains.

### Issue 4: 404 on all pages except homepage
**Solution:** Vercel should auto-detect Next.js. Check "Root Directory" is set to `dashboard-nextjs`.

---

## 📁 Project Structure Explained

```
solana-api/                    ← GitHub repo root
├── index.js                   ← Backend (Render)
├── src/                       ← Backend (Render)
├── package.json               ← Backend (Render)
└── dashboard-nextjs/          ← Frontend (Vercel)
    ├── app/                   ← Pages
    ├── package.json           ← Frontend dependencies
    └── next.config.ts         ← Next.js config
```

**Render** deploys root folder (backend)  
**Vercel** deploys `dashboard-nextjs/` folder (frontend)

---

## 🎯 Deployment Checklist

- [ ] Signed up for Vercel account
- [ ] Imported GitHub repository
- [ ] Set Root Directory to `dashboard-nextjs`
- [ ] Added `NEXT_PUBLIC_PRIVY_APP_ID` env variable
- [ ] Added `NEXT_PUBLIC_API_URL` with Render URL
- [ ] Deployed successfully
- [ ] Updated CORS_ORIGINS in Render
- [ ] Added Vercel URL to Privy dashboard
- [ ] Tested wallet login on production

---

## 🚀 Alternative: Deploy to Render (Static Site)

If you prefer to use Render for both:

1. Create a **new Static Site** on Render
2. Connect same GitHub repo
3. Set Root Directory: `dashboard-nextjs`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `.next`

**Note:** Vercel is recommended for Next.js as it's optimized for it.

---

## 📞 Need Help?

If you get stuck:
1. Check Vercel build logs for errors
2. Verify environment variables are set correctly
3. Make sure Render backend is running (test `/health` endpoint)
4. Check browser console for CORS/API errors

---

**✅ Once deployed, your full-stack app will be live:**
- Backend API: `https://your-app.onrender.com`
- Frontend Dashboard: `https://your-app.vercel.app`

🎉 **Happy Deploying!**
