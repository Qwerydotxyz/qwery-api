#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}║          🧪 Qwery API Test Suite                  ║${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Base URL
API_URL="http://localhost:3000"

# Test token address
TOKEN_ADDRESS="ohnJf8SmDKm2PJmXHKhnEZJ65XuyozP5BwbuXB3pump"

echo -e "${YELLOW}Step 1: Check if server is running...${NC}"
HEALTH_RESPONSE=$(curl -s ${API_URL}/health)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Server is running!${NC}"
    echo "$HEALTH_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Server is not running. Please start it with: node index.js${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 2: Creating a test wallet user...${NC}"
WALLET_ADDRESS="TestWallet$(date +%s)"
AUTH_RESPONSE=$(curl -s -X POST ${API_URL}/api/v1/auth/wallet \
  -H "Content-Type: application/json" \
  -d "{\"walletAddress\": \"${WALLET_ADDRESS}\"}")

echo "$AUTH_RESPONSE" | jq '.'
USER_ID=$(echo "$AUTH_RESPONSE" | jq -r '.data.user.id')
echo -e "${GREEN}✅ User created with ID: ${USER_ID}${NC}"
echo ""

echo -e "${YELLOW}Step 3: Creating API Key...${NC}"
API_KEY_RESPONSE=$(curl -s -X POST "${API_URL}/api/v1/dashboard/api-keys?walletAddress=${WALLET_ADDRESS}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test API Key"}')

echo "$API_KEY_RESPONSE" | jq '.'
API_KEY=$(echo "$API_KEY_RESPONSE" | jq -r '.data.apiKey')

if [ "$API_KEY" == "null" ] || [ -z "$API_KEY" ]; then
    echo -e "${RED}❌ Failed to create API key${NC}"
    exit 1
fi

echo -e "${GREEN}✅ API Key created: ${API_KEY}${NC}"
echo ""

echo -e "${YELLOW}Step 4: Testing API without API Key (should fail)...${NC}"
NO_KEY_RESPONSE=$(curl -s -X POST ${API_URL}/api/v1/token-price \
  -H "Content-Type: application/json" \
  -d "{\"tokenAddresses\": [\"${TOKEN_ADDRESS}\"]}")

echo "$NO_KEY_RESPONSE" | jq '.'
if echo "$NO_KEY_RESPONSE" | jq -e '.error.code == "API_KEY_REQUIRED"' > /dev/null; then
    echo -e "${GREEN}✅ API correctly rejected request without API key${NC}"
else
    echo -e "${RED}❌ API should have rejected request without key${NC}"
fi
echo ""

echo -e "${YELLOW}Step 5: Testing Token Price API WITH API Key...${NC}"
echo -e "${BLUE}Token: ${TOKEN_ADDRESS}${NC}"
echo ""

PRICE_RESPONSE=$(curl -s -X POST ${API_URL}/api/v1/token-price \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d "{\"tokenAddresses\": [\"${TOKEN_ADDRESS}\"]}")

echo "$PRICE_RESPONSE" | jq '.'

if echo "$PRICE_RESPONSE" | jq -e '.status == "success"' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API request successful!${NC}"
    
    # Extract price if available
    if echo "$PRICE_RESPONSE" | jq -e '.data' > /dev/null 2>&1; then
        echo -e "${GREEN}📊 Token price data retrieved successfully!${NC}"
    fi
else
    if echo "$PRICE_RESPONSE" | jq -e '.status == "error"' > /dev/null 2>&1; then
        ERROR_MSG=$(echo "$PRICE_RESPONSE" | jq -r '.error.message')
        echo -e "${YELLOW}⚠️  API returned error: ${ERROR_MSG}${NC}"
    else
        echo -e "${RED}❌ Unexpected response format${NC}"
    fi
fi
echo ""

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}║          ✨ Test Complete!                         ║${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Your API Key (save this): ${API_KEY}${NC}"
echo ""
echo -e "${YELLOW}You can now use this curl command to test:${NC}"
echo ""
echo "curl -X POST ${API_URL}/api/v1/token-price \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -H \"X-API-Key: ${API_KEY}\" \\"
echo "  -d '{\"tokenAddresses\": [\"${TOKEN_ADDRESS}\"]}'"
echo ""

