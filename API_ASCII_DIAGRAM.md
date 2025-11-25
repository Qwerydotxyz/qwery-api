# Qwery API - ASCII Diagrams

## 1. User Authentication Flow (Wallet-Based)

```
┌─────────┐      ┌──────────┐      ┌───────┐      ┌─────────┐      ┌──────────┐
│  User   │      │ Frontend │      │ Privy │      │ Backend │      │ Database │
└────┬────┘      └────┬─────┘      └───┬───┘      └────┬────┘      └────┬─────┘
     │                │                 │               │                │
     │ 1. Visit       │                 │               │                │
     │  Dashboard     │                 │               │                │
     │───────────────>│                 │               │                │
     │                │                 │               │                │
     │                │ 2. Initialize   │               │                │
     │                │    Privy SDK    │               │                │
     │                │────────────────>│               │                │
     │                │                 │               │                │
     │ 3. Click       │                 │               │                │
     │ "Connect       │                 │               │                │
     │  Wallet"       │                 │               │                │
     │───────────────>│                 │               │                │
     │                │                 │               │                │
     │                │ 4. Request      │               │                │
     │                │    Connection   │               │                │
     │                │────────────────>│               │                │
     │                │                 │               │                │
     │                │ 5. Show Phantom │               │                │
     │                │<────────────────┤               │                │
     │<───────────────┤                 │               │                │
     │                │                 │               │                │
     │ 6. Approve     │                 │               │                │
     │    Connection  │                 │               │                │
     │───────────────>│────────────────>│               │                │
     │                │                 │               │                │
     │                │ 7. Return       │               │                │
     │                │    Wallet Addr  │               │                │
     │                │<────────────────┤               │                │
     │                │                 │               │                │
     │                │ 8. POST /auth/wallet            │                │
     │                │    {walletAddress}              │                │
     │                │────────────────────────────────>│                │
     │                │                 │               │                │
     │                │                 │               │ 9. Find/Create │
     │                │                 │               │    User        │
     │                │                 │               │───────────────>│
     │                │                 │               │                │
     │                │                 │               │ 10. User Data  │
     │                │                 │               │<───────────────┤
     │                │                 │               │                │
     │                │                 │  11. Generate │                │
     │                │                 │      JWT      │                │
     │                │                 │               │                │
     │                │ 12. {token, user, apiKeys}      │                │
     │                │<────────────────────────────────┤                │
     │                │                 │               │                │
     │ 13. Redirect   │                 │               │                │
     │    to Dashboard│                 │               │                │
     │<───────────────┤                 │               │                │
     │                │                 │               │                │
```

## 2. API Key Creation Flow

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│  User   │      │ Frontend │      │ Backend │      │ Database │
└────┬────┘      └────┬─────┘      └────┬────┘      └────┬─────┘
     │                │                 │                │
     │ 1. Click       │                 │                │
     │ "Create API    │                 │                │
     │  Key"          │                 │                │
     │───────────────>│                 │                │
     │                │                 │                │
     │ 2. Enter Name  │                 │                │
     │───────────────>│                 │                │
     │                │                 │                │
     │                │ 3. POST /api-keys               │
     │                │    Authorization: Bearer {jwt}  │
     │                │    {name: "My Key"}             │
     │                │────────────────>│                │
     │                │                 │                │
     │                │                 │ 4. Verify JWT  │
     │                │                 │                │
     │                │                 │ 5. Generate    │
     │                │                 │    qwery_live_ │
     │                │                 │    xxxxx       │
     │                │                 │                │
     │                │                 │ 6. INSERT Key  │
     │                │                 │───────────────>│
     │                │                 │                │
     │                │                 │ 7. Key Created │
     │                │                 │<───────────────┤
     │                │                 │                │
     │                │ 8. Return Full  │                │
     │                │    API Key      │                │
     │                │<────────────────┤                │
     │                │                 │                │
     │ 9. Display Key │                 │                │
     │    (ONLY ONCE!)│                 │                │
     │<───────────────┤                 │                │
     │                │                 │                │
     │ 10. Copy Key   │                 │                │
     │───────────────>│                 │                │
     │                │                 │                │
```

## 3. API Request Flow (Token Price Example)

```
┌────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Client │  │ Backend │  │   Rate   │  │   API    │  │ BitQuery │  │ Database │
│        │  │         │  │ Limiter  │  │   Key    │  │          │  │          │
└───┬────┘  └────┬────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
    │            │             │             │             │             │
    │ 1. POST    │             │             │             │             │
    │ /token-    │             │             │             │             │
    │  price     │             │             │             │             │
    │ x-api-key: │             │             │             │             │
    │ qwery_xxx  │             │             │             │             │
    │───────────>│             │             │             │             │
    │            │             │             │             │             │
    │            │ 2. Check    │             │             │             │
    │            │    Rate     │             │             │             │
    │            │    Limit    │             │             │             │
    │            │────────────>│             │             │             │
    │            │             │             │             │             │
    │            │ 3. ✓ OK     │             │             │             │
    │            │    (50/100) │             │             │             │
    │            │<────────────┤             │             │             │
    │            │             │             │             │             │
    │            │ 4. Verify   │             │             │             │
    │            │    API Key  │             │             │             │
    │            │────────────────────────┐  │             │             │
    │            │                        │  │             │             │
    │            │                        ├─────────────┐  │             │
    │            │                        │  │          │  │             │
    │            │                        │  │ 5. Query │  │             │
    │            │                        │  │    Key   │  │             │
    │            │                        │  │─────────────────────────>│
    │            │                        │  │          │  │             │
    │            │                        │  │ 6. Valid │  │             │
    │            │                        │  │<─────────────────────────┤
    │            │                        │  │          │  │             │
    │            │                        ├──┤          │  │             │
    │            │ 7. ✓ Valid │           │  │          │  │             │
    │            │<───────────────────────┘  │          │  │             │
    │            │             │             │          │  │             │
    │            │ 8. GraphQL  │             │          │  │             │
    │            │    Query    │             │          │  │             │
    │            │────────────────────────────────────────>│             │
    │            │             │             │          │  │             │
    │            │             │             │          │  │ 9. Query    │
    │            │             │             │          │  │    Solana   │
    │            │             │             │          │  │             │
    │            │             │             │          │ 10. Token Data │
    │            │             │             │          │  │             │
    │            │ 11. Return  │             │          │  │             │
    │            │     Data    │             │          │  │             │
    │            │<────────────────────────────────────────┤             │
    │            │             │             │          │  │             │
    │            │ 12. Update  │             │          │  │             │
    │            │     Stats   │             │          │  │             │
    │            │───────────────────────────────────────────────────────>│
    │            │             │             │          │  │             │
    │            │ 13. Success │             │          │  │             │
    │            │<───────────────────────────────────────────────────────┤
    │            │             │             │          │  │             │
    │ 14. 200 OK │             │             │          │  │             │
    │    {data}  │             │             │          │  │             │
    │<───────────┤             │             │          │  │             │
    │            │             │             │          │  │             │
```

## 4. Rate Limiting Flow

```
┌────────┐      ┌─────────┐      ┌──────────┐
│ Client │      │ Backend │      │  Memory  │
└───┬────┘      └────┬────┘      └────┬─────┘
    │                │                │
    │ Request #1     │                │
    │───────────────>│                │
    │                │                │
    │                │ Check Limit    │
    │                │───────────────>│
    │                │                │
    │                │ Count: 0       │
    │                │<───────────────┤
    │                │                │
    │                │ Set Count: 1   │
    │                │ Expire: 15min  │
    │                │───────────────>│
    │                │                │
    │ 200 OK         │                │
    │ (1/100)        │                │
    │<───────────────┤                │
    │                │                │
    ╎                ╎                ╎
    ╎  ... 99 more requests ...       ╎
    ╎                ╎                ╎
    │                │                │
    │ Request #101   │                │
    │───────────────>│                │
    │                │                │
    │                │ Check Limit    │
    │                │───────────────>│
    │                │                │
    │                │ Count: 100     │
    │                │<───────────────┤
    │                │                │
    │ 429 Error      │                │
    │ Rate Limited!  │                │
    │<───────────────┤                │
    │                │                │
    ╎ Wait 15 min... ╎                ╎
    │                │                │
    │                │    [EXPIRE]    │
    │                │    Count: 0    │
    │                │                │
    │ New Request    │                │
    │───────────────>│                │
    │                │                │
    │                │ Check Limit    │
    │                │───────────────>│
    │                │                │
    │                │ Count: 0       │
    │                │ (expired)      │
    │                │<───────────────┤
    │                │                │
    │ 200 OK         │                │
    │ (1/100)        │                │
    │<───────────────┤                │
    │                │                │
```

## 5. BitQuery 4-Key Rotation Strategy

```
┌─────────┐      ┌──────────────┐      ┌───────────┐
│ Backend │      │  BitQuery    │      │ BitQuery  │
│         │      │  Service     │      │    API    │
└────┬────┘      └──────┬───────┘      └─────┬─────┘
     │                  │                    │
     │ Get Token Data   │                    │
     │─────────────────>│                    │
     │                  │                    │
     │              Key Index: 0             │
     │              (Current: KEY_1)         │
     │                  │                    │
     │                  │ Request w/ KEY_1   │
     │                  │───────────────────>│
     │                  │                    │
     │                  │ 429 Rate Limited   │
     │                  │<───────────────────┤
     │                  │                    │
     │              Key Index: 1             │
     │              (Rotate to KEY_2)        │
     │                  │                    │
     │                  │ Request w/ KEY_2   │
     │                  │───────────────────>│
     │                  │                    │
     │                  │ 200 OK + Data      │
     │                  │<───────────────────┤
     │                  │                    │
     │ Return Data      │                    │
     │<─────────────────┤                    │
     │                  │                    │
     │                  │                    │
     │ Next Request     │                    │
     │─────────────────>│                    │
     │                  │                    │
     │              Key Index: 2             │
     │              (Next: KEY_3)            │
     │                  │                    │
     │                  │ Request w/ KEY_3   │
     │                  │───────────────────>│
     │                  │                    │
     │                  │ 200 OK + Data      │
     │                  │<───────────────────┤
     │                  │                    │
     │ Return Data      │                    │
     │<─────────────────┤                    │
     │                  │                    │
     
     Rotation: KEY_1 → KEY_2 → KEY_3 → KEY_4 → KEY_1 → ...
     
     Benefits:
     ✓ 4x more requests per time window
     ✓ Automatic failover on rate limits
     ✓ Better reliability & throughput
```

## 6. System Architecture Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                               │
│  ┌─────────────────────┐         ┌──────────────────────┐         │
│  │  Web Dashboard      │         │  Developer Apps      │         │
│  │  (Next.js + React)  │         │  (Any Platform)      │         │
│  └──────────┬──────────┘         └───────────┬──────────┘         │
└─────────────┼────────────────────────────────┼────────────────────┘
              │                                │
              │ HTTPS                          │ HTTPS
              │                                │
┌─────────────┼────────────────────────────────┼────────────────────┐
│             ▼                                ▼    API LAYER        │
│  ┌──────────────────────────────────────────────────────┐         │
│  │            Express.js Server (Node.js)               │         │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │         │
│  │  │   Rate     │  │  API Key   │  │    JWT     │     │         │
│  │  │  Limiter   │  │ Validator  │  │    Auth    │     │         │
│  │  │ (100/15m)  │  │            │  │            │     │         │
│  │  └────────────┘  └────────────┘  └────────────┘     │         │
│  └──────────────────────────────────────────────────────┘         │
└─────────────┬──────────────────────────────────────────────────────┘
              │
              ▼
┌───────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐        │
│  │  BitQuery    │  │    Auth      │  │    API Key       │        │
│  │  Service     │  │   Service    │  │    Service       │        │
│  │ (4 Keys      │  │  (Wallet)    │  │  (Management)    │        │
│  │  Rotation)   │  │              │  │                  │        │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘        │
└─────────┼─────────────────┼───────────────────┼───────────────────┘
          │                 │                   │
          │                 │                   │
          ▼                 ▼                   ▼
┌───────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                │
│  ┌─────────────┐  ┌─────────────────────┐  ┌──────────────────┐  │
│  │ PostgreSQL  │  │  BitQuery GraphQL   │  │     Solana       │  │
│  │  (NeonDB)   │  │    API Gateway      │  │   Blockchain     │  │
│  │             │  │                     │  │                  │  │
│  │  Users      │  │  ┌────────────┐    │  │  ┌─────────────┐ │  │
│  │  ApiKeys    │  │  │  KEY_1     │    │  │  │   Tokens    │ │  │
│  │  Usage      │  │  │  KEY_2     │───────────►   Trades    │ │  │
│  │             │  │  │  KEY_3     │    │  │  │   Prices    │ │  │
│  │             │  │  │  KEY_4     │    │  │  │   Holders   │ │  │
│  └─────────────┘  │  └────────────┘    │  │  └─────────────┘ │  │
│                   └─────────────────────┘  └──────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

## 7. Data Flow Diagram

```
    Developer                  Qwery API                BitQuery              Solana
       App                      Backend                  Service            Blockchain
        │                          │                        │                   │
        │  ①  POST /token-price    │                        │                   │
        │     x-api-key: xxx       │                        │                   │
        │─────────────────────────>│                        │                   │
        │                          │                        │                   │
        │                          │  ②  Validate Key       │                   │
        │                          │──┐                     │                   │
        │                          │  │ ✓ Valid             │                   │
        │                          │<─┘                     │                   │
        │                          │                        │                   │
        │                          │  ③  Rate Limit Check   │                   │
        │                          │──┐                     │                   │
        │                          │  │ ✓ 45/100            │                   │
        │                          │<─┘                     │                   │
        │                          │                        │                   │
        │                          │  ④  GraphQL Query      │                   │
        │                          │───────────────────────>│                   │
        │                          │                        │                   │
        │                          │                        │  ⑤  Fetch Data    │
        │                          │                        │──────────────────>│
        │                          │                        │                   │
        │                          │                        │  ⑥  Token Info    │
        │                          │                        │<──────────────────┤
        │                          │                        │                   │
        │                          │  ⑦  Formatted Data     │                   │
        │                          │<───────────────────────┤                   │
        │                          │                        │                   │
        │                          │  ⑧  Update Usage       │                   │
        │                          │──┐                     │                   │
        │                          │  │ requestCount++      │                   │
        │                          │<─┘                     │                   │
        │                          │                        │                   │
        │  ⑨  200 OK {data}        │                        │                   │
        │<─────────────────────────┤                        │                   │
        │                          │                        │                   │
```

## 8. Request Success vs Error Flow

```
SUCCESS FLOW:
═════════════
Client → Backend → Rate Limiter → API Validator → BitQuery → Solana
   ↓        ↓           ↓              ↓             ↓         ↓
  Send    Receive    ✓ OK         ✓ Valid       Query    Return
Request  Request   (50/100)      Key Found      Data     Data
   │        │           │              │             │         │
   │        └───────────┴──────────────┴─────────────┴─────────┤
   │                    Process & Format Data                   │
   │←──────────────────── 200 OK {data} ─────────────────────────┘


ERROR FLOW 1: Invalid API Key
══════════════════════════════
Client → Backend → API Validator
   │        │           │
  Send    Receive     ✗ Not Found
   │        │           │
   │        │←──────────┘
   │←───── 401 Unauthorized ────┘
           "Invalid API key"


ERROR FLOW 2: Rate Limit Exceeded
══════════════════════════════════
Client → Backend → Rate Limiter
   │        │           │
  Send    Receive    ✗ Limit
   │        │        (100/100)
   │        │           │
   │        │←──────────┘
   │←───── 429 Too Many ────┘
           "Rate limit exceeded"


ERROR FLOW 3: BitQuery Service Error
═════════════════════════════════════
Client → Backend → Rate Limiter → API Validator → BitQuery
   │        │           │              │             │
  Send    Receive    ✓ OK         ✓ Valid       ✗ Error
   │        │           │              │             │
   │        │           │              │             │
   │        │           │              │←────Retry───┤
   │        │           │              │             │
   │        │           │              │────KEY_2───>│
   │        │           │              │             │
   │        │           │              │         ✗ Error
   │        │           │              │             │
   │        │←──────────┴──────────────┴─────────────┘
   │←───── 503 Service Unavailable ──────────────────┘
           "BitQuery service error"
```

## 9. Complete User Journey

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    QWERY API - COMPLETE USER JOURNEY                     ║
╚══════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Registration & Authentication                                   │
└─────────────────────────────────────────────────────────────────────────┘

    User                    Dashboard              Backend          Database
     │                         │                      │                 │
     │ ① Visit qwery.xyz       │                      │                 │
     │────────────────────────>│                      │                 │
     │                         │                      │                 │
     │ ② Click "Connect"       │                      │                 │
     │────────────────────────>│                      │                 │
     │                         │                      │                 │
     │ ③ Approve Phantom       │                      │                 │
     │────────────────────────>│                      │                 │
     │                         │                      │                 │
     │                         │ ④ POST /auth/wallet  │                 │
     │                         │─────────────────────>│                 │
     │                         │                      │ ⑤ Create/Find   │
     │                         │                      │────────────────>│
     │                         │ ⑥ JWT + User Data    │                 │
     │                         │<─────────────────────┤                 │
     │                         │                      │                 │
     │ ⑦ Logged In!            │                      │                 │
     │<────────────────────────┤                      │                 │
     │                         │                      │                 │

┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Create API Key                                                  │
└─────────────────────────────────────────────────────────────────────────┘

     │ ⑧ View Dashboard        │                      │                 │
     │────────────────────────>│                      │                 │
     │                         │                      │                 │
     │ ⑨ Create API Key        │                      │                 │
     │────────────────────────>│                      │                 │
     │                         │                      │                 │
     │                         │ ⑩ POST /api-keys     │                 │
     │                         │─────────────────────>│                 │
     │                         │                      │ ⑪ Generate Key  │
     │                         │                      │────────────────>│
     │                         │ ⑫ qwery_live_xxxxxxx │                 │
     │                         │<─────────────────────┤                 │
     │                         │                      │                 │
     │ ⑬ Copy & Save Key       │                      │                 │
     │<────────────────────────┤                      │                 │
     │                         │                      │                 │

┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Use API in Your App                                             │
└─────────────────────────────────────────────────────────────────────────┘

   Your App                                Qwery Backend        BitQuery
     │                                           │                 │
     │ ⑭ POST /api/v1/token-price               │                 │
     │    x-api-key: qwery_live_xxx             │                 │
     │──────────────────────────────────────────>│                 │
     │                                           │                 │
     │                                           │ ⑮ Validate      │
     │                                           │ ⑯ Rate Check    │
     │                                           │                 │
     │                                           │ ⑰ Query         │
     │                                           │────────────────>│
     │                                           │                 │
     │                                           │ ⑱ Token Data    │
     │                                           │<────────────────┤
     │                                           │                 │
     │ ⑲ 200 OK {price, volume, ...}            │                 │
     │<──────────────────────────────────────────┤                 │
     │                                           │                 │

┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Monitor Usage                                                   │
└─────────────────────────────────────────────────────────────────────────┘

     │ ⑳ View Dashboard        │                      │                 │
     │────────────────────────>│                      │                 │
     │                         │                      │                 │
     │                         │ ㉑ GET /usage/stats  │                 │
     │                         │─────────────────────>│                 │
     │                         │                      │ ㉒ Query Stats  │
     │                         │                      │────────────────>│
     │                         │ ㉓ Charts & Metrics  │                 │
     │                         │<─────────────────────┤                 │
     │                         │                      │                 │
     │ ㉔ See Analytics         │                      │                 │
     │<────────────────────────┤                      │                 │
     │                         │                      │                 │
```

## 10. Key Components Explanation

```
┌─────────────────────────────────────────────────────────────────────┐
│                   QWERY API COMPONENTS                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  AUTHENTICATION LAYER                                       │   │
│  │  • Privy SDK for Phantom wallet integration                 │   │
│  │  • JWT tokens for session management                        │   │
│  │  • Wallet-based user identification                         │   │
│  │  • No email/password required                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  API KEY MANAGEMENT                                         │   │
│  │  • Format: qwery_live_[32_char_random]                      │   │
│  │  • Stored: SHA-256 hash in database                         │   │
│  │  • Full key shown only once at creation                     │   │
│  │  • Can create/delete multiple keys                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  RATE LIMITING                                              │   │
│  │  • 100 requests per 15 minutes per IP                       │   │
│  │  • In-memory or Redis-based tracking                        │   │
│  │  • Returns 429 when limit exceeded                          │   │
│  │  • Auto-reset after time window                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  BITQUERY INTEGRATION                                       │   │
│  │  • 4 API keys for rotation                                  │   │
│  │  • Automatic failover on rate limits                        │   │
│  │  • GraphQL queries to Solana blockchain                     │   │
│  │  • Real-time token data, trades, prices                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  DATABASE SCHEMA                                            │   │
│  │  • Users: id, walletAddress, createdAt                      │   │
│  │  • ApiKeys: id, userId, key, name, stats                    │   │
│  │  • PostgreSQL on NeonDB (serverless)                        │   │
│  │  • Prisma ORM for type-safe queries                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Quick Reference

### API Request Headers
```
POST https://api.qwery.xyz/api/v1/token-price
x-api-key: qwery_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### Response Format
```
Success (200):
{
  "status": "success",
  "data": { ... }
}

Error (4xx/5xx):
{
  "status": "error",
  "error": "Error message"
}
```

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1234567890
```

---

**For more details, see: https://github.com/Qwerydotxyz/qwery-api**
