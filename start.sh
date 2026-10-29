#!/usr/bin/env bash
# School Management ERP System - Quick Start Script

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="/Users/suyashanilmahajan/.gemini/antigravity/bin:$PATH"

echo "=========================================="
echo " Starting School Management ERP System"
echo "=========================================="

# 1. Start MongoDB if not already running
if ! pgrep -x "mongod" > /dev/null; then
  echo "--> Starting MongoDB on port 27017..."
  mkdir -p "$PROJECT_ROOT/backend/data/db"
  mongod --dbpath "$PROJECT_ROOT/backend/data/db" --port 27017 --fork --logpath "$PROJECT_ROOT/backend/data/mongod.log"
else
  echo "--> MongoDB is already running on port 27017."
fi

# 2. Start Backend
echo "--> Starting Backend API on http://localhost:5001..."
cd "$PROJECT_ROOT/backend"
npm start &
BACKEND_PID=$!

# 3. Start Frontend
echo "--> Starting Frontend on http://localhost:3000..."
cd "$PROJECT_ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

echo "=========================================="
echo " ERP System Live & Operational!"
echo " Frontend: http://localhost:3000"
echo " Backend:  http://localhost:5001"
echo "=========================================="

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait

