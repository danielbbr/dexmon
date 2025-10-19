#!/bin/bash

echo "=== Testing botimon Backend ==="
echo ""

# colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # no color

# test login
echo "1. Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}✗ Login failed${NC}"
  exit 1
else
  echo -e "${GREEN}✓ Login successful${NC}"
  echo "Token: ${TOKEN:0:20}..."
fi

echo ""

# test scan
echo "2. Testing network scan..."
SCAN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/scan \
  -H "Authorization: Bearer $TOKEN")

if echo "$SCAN_RESPONSE" | grep -q "onlineKnown"; then
  echo -e "${GREEN}✓ Scan successful${NC}"
  echo "Response preview:"
  echo $SCAN_RESPONSE | head -c 200
  echo "..."
else
  echo -e "${RED}✗ Scan failed${NC}"
  echo $SCAN_RESPONSE
fi

echo ""

# test get devices
echo "3. Testing get devices..."
DEVICES_RESPONSE=$(curl -s http://localhost:3001/api/devices \
  -H "Authorization: Bearer $TOKEN")

if echo "$DEVICES_RESPONSE" | grep -q "onlineKnown"; then
  echo -e "${GREEN}✓ Get devices successful${NC}"
else
  echo -e "${RED}✗ Get devices failed${NC}"
fi

echo ""

# test invalid token
echo "4. Testing invalid token..."
INVALID_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3001/api/devices \
  -H "Authorization: Bearer invalid_token")

if echo "$INVALID_RESPONSE" | grep -q "403"; then
  echo -e "${GREEN}✓ Invalid token correctly rejected${NC}"
else
  echo -e "${RED}✗ Invalid token test failed${NC}"
fi

echo ""
echo "=== Tests completed ==="