#!/bin/bash
# Quick Test Script for Android

echo "🧪 Starting Android App Test..."
echo ""

# Check if backend is running
echo "1️⃣ Checking backend connection..."
curl -s http://localhost:7211/api/messages > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is NOT running!"
    echo "   Start backend first: cd backend/ChatSentimentAPI && dotnet run"
    exit 1
fi

# Check Android device/emulator
echo ""
echo "2️⃣ Checking Android device..."
adb devices | grep -q "device$"
if [ $? -eq 0 ]; then
    echo "✅ Android device connected"
else
    echo "❌ No Android device found!"
    echo "   Start an emulator or connect a device"
    exit 1
fi

# Start Metro bundler in background
echo ""
echo "3️⃣ Starting Metro bundler..."
npm start -- --reset-cache &
METRO_PID=$!
sleep 5

# Build and run on Android
echo ""
echo "4️⃣ Building and installing app..."
npm run android

# Keep Metro running
echo ""
echo "✅ App is running!"
echo "📱 Test the following:"
echo "   - Login with a nickname"
echo "   - Send messages"
echo "   - Check sentiment analysis"
echo "   - Test logout"
echo ""
echo "Press Ctrl+C to stop Metro bundler"

# Wait for Metro
wait $METRO_PID