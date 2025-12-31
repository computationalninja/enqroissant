#!/bin/bash
echo "=========================================="
echo "  Quantum Digital Twin - Setup Script"
echo "=========================================="
echo ""

echo "[1/2] Installing Frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Frontend installation failed."
    exit 1
fi

echo ""
echo "[2/2] Installing Backend dependencies..."
cd backend
pip install -r requirements.txt || pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Backend installation failed."
    exit 1
fi

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "  Run './start.sh' to launch the platform."
echo "=========================================="
echo ""
