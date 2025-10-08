# Quick Test Script for Android (PowerShell)
# Usage: .\test-android.ps1

Write-Host "🧪 Starting Android App Test..." -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "1️⃣ Checking backend connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:7211/api/messages" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is NOT running!" -ForegroundColor Red
    Write-Host "   Start backend first:" -ForegroundColor Yellow
    Write-Host "   cd backend\ChatSentimentAPI; dotnet run" -ForegroundColor White
    exit 1
}

# Check Android device/emulator
Write-Host ""
Write-Host "2️⃣ Checking Android device..." -ForegroundColor Yellow
$devices = adb devices
if ($devices -match "device$") {
    Write-Host "✅ Android device connected" -ForegroundColor Green
} else {
    Write-Host "❌ No Android device found!" -ForegroundColor Red
    Write-Host "   Start an emulator or connect a device" -ForegroundColor Yellow
    exit 1
}

# Check .env configuration
Write-Host ""
Write-Host "3️⃣ Checking .env configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file not found. Creating from example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env created. Review and update if needed." -ForegroundColor Green
}

# Start Metro bundler
Write-Host ""
Write-Host "4️⃣ Starting Metro bundler..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start -- --reset-cache"
Start-Sleep -Seconds 5

# Build and run on Android
Write-Host ""
Write-Host "5️⃣ Building and installing app..." -ForegroundColor Yellow
npm run android

Write-Host ""
Write-Host "✅ App should be running on your device!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Test Checklist:" -ForegroundColor Cyan
Write-Host "   ☐ Login with a nickname" -ForegroundColor White
Write-Host "   ☐ Send positive message: 'I love this!'" -ForegroundColor White
Write-Host "   ☐ Send negative message: 'This is terrible'" -ForegroundColor White
Write-Host "   ☐ Send neutral message: 'Weather is okay'" -ForegroundColor White
Write-Host "   ☐ Check sentiment emojis appear" -ForegroundColor White
Write-Host "   ☐ Verify score percentages" -ForegroundColor White
Write-Host "   ☐ Test logout" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Developer Menu: Ctrl+M (or shake device)" -ForegroundColor Yellow
Write-Host "🔄 Reload App: Press R in Metro terminal" -ForegroundColor Yellow
Write-Host ""