#!/bin/bash
echo "=========================================="
echo "  Quantum Digital Twin - Platform Starter"
echo "=========================================="
echo ""

# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo "[!] Frontend dependencies missing. Running setup..."
    npm install
fi

# Start backend in background
echo "[1/2] Starting Backend Server..."
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "[2/2] Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "  Servers are starting!"
echo ""
echo "  - DASHBOARD: http://localhost:3000"
echo "  - BACKEND API: http://localhost:5000"
echo ""
echo "  Press Ctrl+C to stop both servers"
echo "=========================================="
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
