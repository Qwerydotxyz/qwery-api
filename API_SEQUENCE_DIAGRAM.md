# Qwery API - Sequence Diagrams

## 1. User Authentication Flow (Wallet-Based)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Privy
    participant Backend
    participant Database
    
    User->>Frontend: Visit Dashboard
    Frontend->>Privy: Initialize Privy SDK
    User->>Frontend: Click "Connect Wallet"
    Frontend->>Privy: Request Wallet Connection
    Privy->>User: Show Phantom Wallet Prompt
    User->>Privy: Approve Connection
    Privy->>Frontend: Return Wallet Address
    Frontend->>Backend: POST /api/v1/auth/wallet<br/>{walletAddress}
    Backend->>Database: Find or Create User<br/>by Wallet Address
    Database->>Backend: Return User Data
    Backend->>Backend: Generate JWT Token
    Backend->>Frontend: Return {token, user, apiKeys}
    Frontend->>Frontend: Store Token in LocalStorage
    Frontend->>User: Redirect to Dashboard
```

## 2. API Key Creation Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Click "Create New API Key"
    User->>Frontend: Enter Key Name
    Frontend->>Frontend: Get JWT from LocalStorage
    Frontend->>Backend: POST /api/v1/dashboard/api-keys<br/>Authorization: Bearer {token}<br/>{name}
    Backend->>Backend: Verify JWT Token
    Backend->>Backend: Generate Unique API Key<br/>(qwery_live_...)
    Backend->>Database: INSERT INTO ApiKey<br/>{userId, name, key, prefix}
    Database->>Backend: Return Created Key
    Backend->>Frontend: Return {id, key, name, createdAt}
    Frontend->>User: Display Full API Key<br/>(Only shown once!)
    User->>User: Copy and Save API Key
```

## 3. API Request Flow (Token Price Example)

```mermaid
sequenceDiagram
    participant Client
    participant Backend
    participant RateLimiter
    participant APIKeyValidator
    participant BitQuery
    participant Database
    
    Client->>Backend: POST /api/v1/token-price<br/>x-api-key: qwery_live_xxx<br/>{tokenAddress}
    Backend->>RateLimiter: Check Rate Limit<br/>(100 req/15min)
    RateLimiter-->>Backend: ✓ Allowed
    Backend->>APIKeyValidator: Verify API Key
    APIKeyValidator->>Database: SELECT * FROM ApiKey<br/>WHERE key = ?
    Database-->>APIKeyValidator: Return Key Data
    APIKeyValidator-->>Backend: ✓ Valid Key
    Backend->>Backend: Parse Request Body<br/>Extract tokenAddress
    Backend->>BitQuery: POST GraphQL Query<br/>Authorization: Bearer {bitquery_key}<br/>{tokenAddress, timeframe}
    BitQuery->>BitQuery: Execute Query on<br/>Solana Blockchain
    BitQuery-->>Backend: Return Token Data<br/>{price, volume, trades}
    Backend->>Database: UPDATE ApiKey<br/>SET lastUsedAt = NOW()<br/>requestCount += 1
    Backend->>Backend: Format Response
    Backend-->>Client: 200 OK<br/>{status, data: {price, volume}}
```

## 4. Rate Limiting Flow

```mermaid
sequenceDiagram
    participant Client
    participant Backend
    participant RateLimiter
    participant Redis/Memory
    
    Client->>Backend: API Request #1
    Backend->>RateLimiter: Check Rate Limit
    RateLimiter->>Redis/Memory: GET request_count_{ip}
    Redis/Memory-->>RateLimiter: count: 0
    RateLimiter->>Redis/Memory: SET request_count_{ip} = 1<br/>EXPIRE 15min
    RateLimiter-->>Backend: ✓ Allowed (1/100)
    Backend-->>Client: 200 OK + Data
    
    Note over Client,Backend: ... 99 more requests ...
    
    Client->>Backend: API Request #101
    Backend->>RateLimiter: Check Rate Limit
    RateLimiter->>Redis/Memory: GET request_count_{ip}
    Redis/Memory-->>RateLimiter: count: 100
    RateLimiter-->>Backend: ✗ Rate Limit Exceeded
    Backend-->>Client: 429 Too Many Requests<br/>{error: "Rate limit exceeded"}
    
    Note over Client,Backend: Wait 15 minutes...
    
    Redis/Memory->>Redis/Memory: Key Expires After 15min
    Client->>Backend: API Request (New Window)
    RateLimiter->>Redis/Memory: GET request_count_{ip}
    Redis/Memory-->>RateLimiter: count: 0 (expired)
    RateLimiter-->>Backend: ✓ Allowed (1/100)
```

## 5. Multi-Key BitQuery Rotation Flow

```mermaid
sequenceDiagram
    participant Backend
    participant BitQueryService
    participant BitQuery1
    participant BitQuery2
    participant BitQuery3
    participant BitQuery4
    
    Backend->>BitQueryService: Request Token Data
    BitQueryService->>BitQueryService: Get Current Key Index (0)
    BitQueryService->>BitQuery1: POST GraphQL<br/>x-api-key: KEY_1
    BitQuery1-->>BitQueryService: 429 Rate Limited
    BitQueryService->>BitQueryService: Increment Key Index (1)
    BitQueryService->>BitQuery2: POST GraphQL<br/>x-api-key: KEY_2
    BitQuery2-->>BitQueryService: 200 OK + Data
    BitQueryService-->>Backend: Return Data
    
    Note over Backend,BitQuery4: Next request uses KEY_3
    
    Backend->>BitQueryService: Request Another Query
    BitQueryService->>BitQueryService: Get Current Key Index (2)
    BitQueryService->>BitQuery3: POST GraphQL<br/>x-api-key: KEY_3
    BitQuery3-->>BitQueryService: 200 OK + Data
    BitQueryService-->>Backend: Return Data
    
    Note over Backend,BitQuery4: Rotation continues: KEY_4 → KEY_1 → KEY_2...
```

## 6. Error Handling Flow

```mermaid
sequenceDiagram
    participant Client
    participant Backend
    participant Database
    participant BitQuery
    
    Client->>Backend: POST /api/v1/token-price<br/>Invalid API Key
    Backend->>Database: SELECT * FROM ApiKey
    Database-->>Backend: Key Not Found
    Backend-->>Client: 401 Unauthorized<br/>{error: "Invalid API key"}
    
    Client->>Backend: POST /api/v1/token-price<br/>Valid Key, Invalid Address
    Backend->>Backend: Validate Token Address
    Backend-->>Client: 400 Bad Request<br/>{error: "Invalid token address"}
    
    Client->>Backend: POST /api/v1/token-price<br/>Valid Request
    Backend->>BitQuery: POST GraphQL Query
    BitQuery-->>Backend: 500 Internal Error
    Backend->>Backend: Retry with Next Key
    Backend->>BitQuery: POST GraphQL Query (KEY_2)
    BitQuery-->>Backend: Still Error
    Backend-->>Client: 503 Service Unavailable<br/>{error: "BitQuery service error"}
```

## 7. Dashboard API Keys Management Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: View API Keys Page
    Frontend->>Backend: GET /api/v1/dashboard/api-keys<br/>Authorization: Bearer {token}
    Backend->>Backend: Verify JWT
    Backend->>Database: SELECT * FROM ApiKey<br/>WHERE userId = ?
    Database-->>Backend: Return All Keys
    Backend-->>Frontend: Return [{id, prefix, name, stats}]
    Frontend->>User: Display Keys List<br/>(only showing prefix)
    
    User->>Frontend: Click "Delete Key"
    Frontend->>User: Confirm Deletion
    User->>Frontend: Confirm
    Frontend->>Backend: DELETE /api/v1/dashboard/api-keys/{id}<br/>Authorization: Bearer {token}
    Backend->>Backend: Verify JWT & Ownership
    Backend->>Database: DELETE FROM ApiKey<br/>WHERE id = ? AND userId = ?
    Database-->>Backend: Key Deleted
    Backend-->>Frontend: 200 OK {status: "success"}
    Frontend->>Frontend: Remove Key from List
    Frontend->>User: Show Success Message
```

## 8. Complete End-to-End Flow

```mermaid
sequenceDiagram
    participant Developer
    participant Dashboard
    participant QweryAPI
    participant BitQuery
    participant Solana
    participant DeveloperApp
    
    rect rgb(240, 248, 255)
        Note over Developer,Dashboard: Step 1: Registration
        Developer->>Dashboard: Connect Phantom Wallet
        Dashboard->>QweryAPI: Authenticate Wallet
        QweryAPI-->>Dashboard: Return JWT + User Data
    end
    
    rect rgb(255, 248, 240)
        Note over Developer,Dashboard: Step 2: Create API Key
        Developer->>Dashboard: Create New API Key
        Dashboard->>QweryAPI: POST /api-keys
        QweryAPI-->>Dashboard: Return qwery_live_xxx
        Developer->>Developer: Copy & Save API Key
    end
    
    rect rgb(240, 255, 240)
        Note over Developer,DeveloperApp: Step 3: Integration
        Developer->>DeveloperApp: Add API Key to App
        DeveloperApp->>QweryAPI: POST /token-price<br/>x-api-key: qwery_live_xxx
        QweryAPI->>BitQuery: Query Blockchain Data
        BitQuery->>Solana: Fetch Token Data
        Solana-->>BitQuery: Return Raw Data
        BitQuery-->>QweryAPI: Return Processed Data
        QweryAPI-->>DeveloperApp: Return Formatted Response
        DeveloperApp->>Developer: Display Token Price
    end
    
    rect rgb(255, 240, 240)
        Note over Developer,Dashboard: Step 4: Monitor Usage
        Developer->>Dashboard: View Analytics
        Dashboard->>QweryAPI: GET /usage/stats
        QweryAPI-->>Dashboard: Return Request Count, Charts
        Dashboard->>Developer: Display Usage Graphs
    end
```

## Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Dashboard<br/>Next.js + React]
        B[Developer Apps<br/>Any Platform]
    end
    
    subgraph "API Layer"
        C[Express.js Server<br/>Node.js]
        D[Rate Limiter<br/>100 req/15min]
        E[API Key Validator]
        F[JWT Auth]
    end
    
    subgraph "Service Layer"
        G[BitQuery Service<br/>4 Keys Rotation]
        H[Auth Service<br/>Wallet-based]
        I[API Key Service<br/>Key Management]
    end
    
    subgraph "Data Layer"
        J[(PostgreSQL<br/>NeonDB)]
        K[BitQuery GraphQL<br/>API Gateway]
        L[Solana Blockchain<br/>Data Source]
    end
    
    A -->|HTTPS| C
    B -->|HTTPS| C
    C --> D
    C --> E
    C --> F
    D --> C
    E --> I
    F --> H
    C --> G
    G --> K
    K --> L
    H --> J
    I --> J
    
    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#fff4e1
    style D fill:#ffe1e1
    style E fill:#ffe1e1
    style F fill:#ffe1e1
    style G fill:#e1ffe1
    style H fill:#e1ffe1
    style I fill:#e1ffe1
    style J fill:#f0e1ff
    style K fill:#ffe1f0
    style L fill:#ffe1f0
```

---

## How to Use These Diagrams in README

Copy and paste any of the above Mermaid code blocks into your README.md file. GitHub automatically renders Mermaid diagrams!

Example:
\`\`\`mermaid
[paste the diagram code here]
\`\`\`

### Key Components Explained:

1. **Authentication**: Wallet-based using Privy + JWT
2. **API Keys**: Unique keys with prefix `qwery_live_`
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **BitQuery Rotation**: 4 API keys rotating to maximize throughput
5. **Database**: PostgreSQL storing users, API keys, and usage stats
6. **Security**: JWT tokens, API key validation, CORS protection

### Request Flow Summary:
1. Client sends request with `x-api-key` header
2. Backend validates key and checks rate limits
3. Query sent to BitQuery GraphQL API
4. BitQuery fetches data from Solana blockchain
5. Response formatted and returned to client
6. Usage stats updated in database
