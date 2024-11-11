#!/bin/bash

cd "$(dirname "$0")"

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