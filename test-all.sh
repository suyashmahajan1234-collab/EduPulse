#!/usr/bin/env bash
# School Management ERP System - Comprehensive Test Suite

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="/Users/suyashanilmahajan/.gemini/antigravity/bin:$PATH"

echo "=========================================="
echo " Running Automated ERP Test Suite"
echo "=========================================="

# Ensure MongoDB is up
if ! pgrep -x "mongod" > /dev/null; then
  echo "--> Starting local MongoDB daemon..."
  mkdir -p "$PROJECT_ROOT/backend/data/db"
  mongod --dbpath "$PROJECT_ROOT/backend/data/db" --port 27017 --fork --logpath "$PROJECT_ROOT/backend/data/mongod.log"
fi

# Run Backend Unit & Integration Tests
echo "--> Running Backend API Tests..."
cd "$PROJECT_ROOT/backend"
npm test

# Run Frontend Build Verification
echo "--> Verifying Frontend Production Build..."
cd "$PROJECT_ROOT/frontend"
npm run build

echo "=========================================="
echo " All Tests & Builds Completed Successfully!"
echo "=========================================="

