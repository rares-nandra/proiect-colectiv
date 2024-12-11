#!/bin/bash

cd "$(dirname "$0")"

echo "Starting MongoDB service..."
if ! brew services start mongodb-community; then
    echo "Warning: Failed to start MongoDB. Please ensure it is running manually if needed."
fi

echo "Installing backend dependencies..."
if ! pip install -r ./backend/requirements.txt; then
    echo "pip failed, trying pip3..."
    pip3 install -r ./backend/requirements.txt
fi

echo "Starting backend app..."
python3 ./backend/app.py &

echo "Installing frontend dependencies..."
cd ./frontend
npm install

echo "Starting frontend app..."
npm run start