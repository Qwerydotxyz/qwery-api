Qwery - Solana API Platform

[![Node.js](https://img.shields.io/badge/node-%3E=_18-green.svg)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/javascript-ES2022-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GraphQL](https://img.shields.io/badge/graph-ql-E10098.svg)](https://graphql.org/)
[![Apollo Server](https://img.shields.io/badge/Apollo%20Server-4.x-1e90ff.svg)](https://www.apollographql.com/docs/apollo-server/)
[![npm version](https://img.shields.io/npm/v/your-package-name.svg)]([https://www.npmjs.com/](https://github.com/Qwerydotxyz/qwery-sdk))
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


**Qwery** is a comprehensive Solana blockchain data API platform with Phantom wallet authentication, API key management, and real-time token analytics.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Configuration](#configuration)
8. [Running the Application](#running-the-application)
9. [API Documentation](#api-documentation)
10. [Authentication Flow](#authentication-flow)
11. [Database Schema](#database-schema)
12. [Deployment Guide](#deployment-guide)
13. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Qwery provides a user-friendly dashboard for accessing Solana blockchain data through a REST API. Users authenticate using Phantom wallet (Solana), manage API keys, and track their API usage.

### Key Capabilities:
- **Wallet-Based Authentication**: Secure login using Solana Phantom wallet via Privy
- **API Key Management**: Create, view, and delete API keys
- **Token Analytics**: Access real-time Solana token data, trades, prices, and holder information
- **Usage Tracking**: Monitor API requests and rate limits
- **Documentation**: Complete API reference with examples

---

## ✨ Features

### Frontend (Next.js Dashboard)
- ✅ Phantom wallet authentication (Privy integration)
- ✅ Clean, minimalist UI with Qwery branding
- ✅ Dashboard with user profile
- ✅ API key creation and management
- ✅ Interactive API documentation
- ✅ Responsive design
- ✅ Real-time wallet connection status

### Backend (Express.js API)
- ✅ Wallet-based authentication
- ✅ API key generation with `qwery_` prefix
- ✅ PostgreSQL database with Prisma ORM
- ✅ Rate limiting and usage tracking
- ✅ 13+ Solana data endpoints
- ✅ CORS configuration
- ✅ BitQuery integration for blockchain data

---

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Privy React Auth (@privy-io/react-auth)
- **Wallet**: Solana Phantom wallet
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (ES6+)
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Authentication**: Custom wallet-based + JWT
- **External API**: BitQuery (Solana blockchain data)

### Database
- **PostgreSQL** with the following tables:
  - Users (with wallet addresses)
  - API Keys
  - Usage logs
  - Rate limits

---


---

## 📦 Prerequisites

Before installing, ensure you have:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **PostgreSQL**: v14 or higher (or NeonDB account)
- **Phantom Wallet**: Browser extension installed
- **BitQuery API Keys**: For blockchain data access
- **Privy Account**: For wallet authentication (free tier available)

---

## 🔧 Installation

### 1. Clone the Repository

```bash
cd ~/Desktop
# If you have the project folder already:
cd graphql/solana-api
```

### 2. Install Backend Dependencies

```bash
# From the root directory (solana-api/)
npm install
```

### 3. Install Frontend Dependencies

```bash
cd dashboard-nextjs
npm install --legacy-peer-deps
cd ..
```

**Note**: `--legacy-peer-deps` is required due to Solana package peer dependency conflicts.

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the root directory (`solana-api/.env`):

```bash
# Database
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# Qwery API Keys (get from https://qwery.xyz/)
QWERY_API="Your Qwery Api"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# Server Configuration
NODE_ENV="development"
PORT=3000

# CORS Origins (comma-separated)
CORS_ORIGINS="http://localhost:3001,http://localhost:3000"
```

### Frontend Configuration

Create a `.env.local` file in the dashboard directory (`solana-api/dashboard-nextjs/.env.local`):

```bash
# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:3000/api/v1"

# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID="cmhpop6dv006ijn0cutytdmv5"
```

### Database Setup

1. **Run Prisma migrations**:

```bash
# From root directory
npx prisma migrate deploy
```

2. **Seed the database** (optional):

```bash
npx prisma db seed
```

3. **View database**:

```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` to view your database.

---

## 🚀 Running the Application

### Development Mode

You can run both servers simultaneously or separately:

#### Option 1: Run Both Servers Together

```bash
# From root directory
chmod +x start-servers.sh
./start-servers.sh
```

This starts:
- Backend API on `http://localhost:3000`
- Frontend Dashboard on `http://localhost:3001`

#### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd ~/Desktop/graphql/solana-api
node src/server.js
```

**Terminal 2 - Frontend:**
```bash
cd ~/Desktop/graphql/solana-api/dashboard-nextjs
npm run dev
```

### Accessing the Application

1. **Frontend**: Open `http://localhost:3001` in your browser
2. **Connect Phantom Wallet**: Click "Connect Wallet" and approve the connection
3. **Access Dashboard**: After authentication, you'll see the dashboard
4. **Create API Key**: Go to "API Keys" page and create your first key
5. **Test API**: Use the documentation page to test endpoints

---

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication Methods

Qwery supports two authentication methods:

1. **Wallet Authentication** (Dashboard login):
   - POST `/api/v1/auth/wallet`
   - Body: `{ "walletAddress": "YOUR_SOLANA_ADDRESS" }`

2. **API Key Authentication** (API requests):
   - Header: `X-API-Key: qwery_your_api_key_here`

### Available Endpoints

#### Token Data

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/token-price` | POST | Get current token price(s) |
| `/api/v1/token-metadata` | POST | Get token metadata (name, symbol, decimals) |
| `/api/v1/top-holders` | POST | Get top holders of a token |

#### Trading Data

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/latest-trades` | POST | Get latest trades across all tokens |
| `/api/v1/wallet-trades` | POST | Get trades for a specific wallet |
| `/api/v1/balance-updates` | POST | Get balance update history |

#### Bonding Curve & Tokens

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/bonding-curve` | POST | Get tokens on bonding curve |
| `/api/v1/top-pumpfun-tokens` | POST | Get top Pumpfun tokens |

#### Letsbonk Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/letsbonk-bonding-curve` | POST | Letsbonk tokens on bonding curve |
| `/api/v1/letsbonk-above-95` | POST | Letsbonk tokens above 95% progress |
| `/api/v1/letsbonk-top-graduating` | POST | Top graduating Letsbonk tokens |

#### Raydium Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/raydium-bonding-curve` | POST | Raydium tokens on bonding curve |
| `/api/v1/raydium-above-95` | POST | Raydium tokens above 95% progress |
| `/api/v1/raydium-graduated` | POST | Tokens graduated to Raydium |
| `/api/v1/raydium-top-graduating` | POST | Top graduating Raydium tokens |

#### Dashboard Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/dashboard/api-keys` | GET | List user's API keys |
| `/api/v1/dashboard/api-keys` | POST | Create new API key |
| `/api/v1/dashboard/api-keys/:id` | DELETE | Delete an API key |
| `/api/v1/dashboard/usage` | GET | Get API usage statistics |

### Example API Request

```bash
curl -X POST http://localhost:3000/api/v1/token-price \
  -H "Content-Type: application/json" \
  -H "X-API-Key: qwery_your_api_key_here" \
  -d '{
    "tokenAddresses": ["So11111111111111111111111111111111111111112"]
  }'
```

### Example Response

```json
{
  "status": "success",
  "data": {
    "prices": [
      {
        "address": "So11111111111111111111111111111111111111112",
        "price": 95.42,
        "symbol": "SOL",
        "timestamp": "2025-11-23T10:30:00Z"
      }
    ]
  }
}
```

---

## 🔐 Authentication Flow

### How Wallet Authentication Works

1. **User visits landing page** (`http://localhost:3001`)
2. **Clicks "Connect Wallet"** → Privy modal opens
3. **Selects Phantom Wallet** → Browser extension prompts for approval
4. **Approves connection** → Privy returns wallet address
5. **Frontend sends wallet address** to `/api/v1/auth/wallet`
6. **Backend checks database**:
   - If wallet exists → Returns user data + API keys
   - If new wallet → Creates new user account
7. **User is authenticated** → Redirected to dashboard
8. **API keys are displayed** → User can create more keys
9. **User makes API requests** → Using `X-API-Key` header

### Multi-Source Wallet Detection

The frontend checks multiple sources for wallet address:

```typescript
// Method 1: From wallets array
wallets[0]?.address

// Method 2: From Privy user object
privyUser?.wallet?.address

// Method 3: From linked accounts
privyUser?.linkedAccounts?.find(acc => acc.type === 'wallet')?.address
```

This ensures reliable wallet detection after Privy authentication.

---

## 🗄️ Database Schema

### Users Table

```prisma
model User {
  id            Int       @id @default(autoincrement())
  email         String?   @unique
  password      String?
  name          String    @default("Anonymous User")
  walletAddress String?   @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  apiKeys       ApiKey[]
}
```

### ApiKey Table

```prisma
model ApiKey {
  id           Int       @id @default(autoincrement())
  key          String    @unique
  keyPrefix    String
  name         String    @default("My API Key")
  userId       Int
  user         User      @relation(fields: [userId], references: [id])
  createdAt    DateTime  @default(now())
  lastUsedAt   DateTime?
  requestCount Int       @default(0)
  isActive     Boolean   @default(true)
}
```

### Key Features

- **Wallet Address**: Unique constraint for one account per wallet
- **API Key Format**: `qwery_` prefix + 32-character random string
- **Key Prefix Storage**: Only prefix stored for security (e.g., `qwery_abcd1234********`)
- **Usage Tracking**: `requestCount` and `lastUsedAt` updated on each request
- **Soft Delete**: `isActive` flag for deactivation

---

## 🌐 Deployment Guide

### Prerequisites for Deployment

1. **GitHub Account** (for code hosting)
2. **Vercel Account** (for frontend) - Free tier available
3. **Railway/Render Account** (for backend) - Free tier available
4. **NeonDB Account** (for PostgreSQL) - Free tier available

### Step-by-Step Deployment

#### 1. Prepare Your Code

Update environment variables to use production values:

**Backend (`solana-api/.env`)**:
```bash
DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"
NODE_ENV="production"
PORT=3000
CORS_ORIGINS="https://your-frontend.vercel.app"
```

**Frontend (`dashboard-nextjs/.env.local`)**:
```bash
NEXT_PUBLIC_API_URL="https://your-backend.railway.app/api/v1"
NEXT_PUBLIC_PRIVY_APP_ID="cmhpop6dv006ijn0cutytdmv5"
```

#### 2. Push to GitHub

```bash
cd ~/Desktop/graphql/solana-api
git init
git add .
git commit -m "Initial commit - Qwery API Platform"
git branch -M main
git remote add origin https://github.com/yourusername/qwery-api.git
git push -u origin main
```

#### 3. Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables (from `.env`)
5. Deploy settings:
   - **Root Directory**: `/` (or `solana-api/`)
   - **Start Command**: `node src/server.js`
   - **Port**: `3000`
6. Copy your Railway URL: `https://qwery-api-production.railway.app`

#### 4. Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project" → Import from GitHub
3. Select your repository
4. Configure:
   - **Root Directory**: `dashboard-nextjs`
   - **Framework**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL
   - `NEXT_PUBLIC_PRIVY_APP_ID`: Your Privy app ID
6. Deploy!

#### 5. Update Privy Configuration

1. Go to [Privy Dashboard](https://dashboard.privy.io)
2. Add your Vercel domain to allowed origins
3. Save changes

#### 6. Test Production

Visit your Vercel URL and test:
- ✅ Phantom wallet connection
- ✅ Dashboard loads after authentication
- ✅ API key creation
- ✅ API requests work

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Loading stuck" after Phantom login

**Cause**: Wallet address not detected properly

**Solution**: 
- Check browser console for wallet detection logs
- Ensure Privy is configured correctly
- Wait 1-2 seconds for wallet to load
- Try refreshing the page

#### 2. API requests fail with CORS error

**Cause**: Backend not allowing frontend origin

**Solution**:
```javascript
// In src/server.js, update CORS origins:
const corsOptions = {
  origin: ['http://localhost:3001', 'https://your-frontend.vercel.app'],
  credentials: true
};
```

#### 3. Database connection fails

**Cause**: Invalid DATABASE_URL or network issue

**Solution**:
```bash
# Test connection:
npx prisma db pull

# If fails, check:
# - DATABASE_URL format
# - Network/firewall settings
# - Database server is running
```

#### 4. "Cannot find module @solana-program/memo"

**Cause**: Missing Solana dependency

**Solution**:
```bash
cd dashboard-nextjs
npm install @solana-program/memo@^0.8.0 --legacy-peer-deps
```

#### 5. API key not working

**Cause**: Wrong header format

**Solution**:
```bash
# Correct header:
X-API-Key: qwery_your_key_here

# NOT:
Authorization: Bearer qwery_your_key_here
```

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=* node src/server.js

# Frontend
npm run dev
# Check browser console (F12)
```

---

## 📝 Additional Documentation Files

- **API_DOCUMENTATION.md**: Complete API reference
- **SETUP.md**: Quick setup guide
- **PRIVY_INTEGRATION.md**: Privy authentication setup
- **FIXES_APPLIED.md**: History of bug fixes

---

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

---

## 📄 License

Proprietary - All rights reserved.

---

## 🎉 You're All Set!

Your Qwery platform is ready to use! 

**Quick Start Checklist:**
- ✅ Install dependencies
- ✅ Configure `.env` files
- ✅ Run database migrations
- ✅ Start both servers
- ✅ Connect Phantom wallet
- ✅ Create API key
- ✅ Make your first API request

**Need Help?** Check the troubleshooting section or review the API documentation page in your dashboard.

---

**Built with ❤️ using Next.js, Express, Prisma, and Solana**
