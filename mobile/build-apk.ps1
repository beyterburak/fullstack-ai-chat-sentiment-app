# Quick APK Build Script (PowerShell)
# Usage: .\build-apk.ps1

param(
    [switch]$Clean,
    [switch]$Production
)

Write-Host "📦 Android APK Build Script" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Environment Configuration
if ($Production) {
    Write-Host "🌍 Setting PRODUCTION environment..." -ForegroundColor Yellow
    Copy-Item ".env.production" ".env" -Force
    Write-Host "✅ Production .env copied" -ForegroundColor Green
} else {
    Write-Host "🌍 Using current .env configuration..." -ForegroundColor Yellow
}

# Step 2: Check keystore
Write-Host ""
Write-Host "🔐 Checking signing keystore..." -ForegroundColor Yellow
if (Test-Path "android\app\chat-sentiment-release.keystore") {
    Write-Host "✅ Keystore found" -ForegroundColor Green
} else {
    Write-Host "❌ Keystore NOT found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "You need to generate a keystore first:" -ForegroundColor Yellow
    Write-Host "cd android\app" -ForegroundColor White
    Write-Host "keytool -genkeypair -v -storetype PKCS12 -keystore chat-sentiment-release.keystore -alias chat-sentiment-alias -keyalg RSA -keysize 2048 -validity 10000" -ForegroundColor White
    Write-Host ""
    Write-Host "Then update android\gradle.properties with your passwords" -ForegroundColor Yellow
    exit 1
}

# Step 3: Check gradle.properties
Write-Host ""
Write-Host "⚙️  Checking gradle.properties..." -ForegroundColor Yellow
if (Test-Path "android\gradle.properties") {
    $props = Get-Content "android\gradle.properties" -Raw
    if ($props -match "MYAPP_UPLOAD_STORE_FILE") {
        Write-Host "✅ Signing configuration found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Signing configuration missing in gradle.properties" -ForegroundColor Yellow
        Write-Host "Add these lines to android\gradle.properties:" -ForegroundColor Yellow
        Write-Host @"
MYAPP_UPLOAD_STORE_FILE=chat-sentiment-release.keystore
MYAPP_UPLOAD_KEY_ALIAS=chat-sentiment-alias
MYAPP_UPLOAD_STORE_PASSWORD=YOUR_PASSWORD
MYAPP_UPLOAD_KEY_PASSWORD=YOUR_PASSWORD
"@ -ForegroundColor White
        exit 1
    }
} else {
    Write-Host "❌ gradle.properties not found!" -ForegroundColor Red
    exit 1
}

# Step 4: Clean if requested
if ($Clean) {
    Write-Host ""
    Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
    Push-Location android
    .\gradlew.bat clean
    Pop-Location
    Write-Host "✅ Clean complete" -ForegroundColor Green
}

# Step 5: Build APK
Write-Host ""
Write-Host "🏗️  Building release APK..." -ForegroundColor Yellow
Write-Host "This may take 5-10 minutes..." -ForegroundColor Gray
Write-Host ""

Push-Location android
$buildResult = .\gradlew.bat assembleRelease
Pop-Location

# Step 6: Check build result
Write-Host ""
if (Test-Path "android\app\build\outputs\apk\release\app-release.apk") {
    Write-Host "✅ BUILD SUCCESSFUL!" -ForegroundColor Green
    Write-Host ""
    
    # Get APK info
    $apk = Get-Item "android\app\build\outputs\apk\release\app-release.apk"
    $sizeInMB = [math]::Round($apk.Length / 1MB, 2)
    
    Write-Host "📦 APK Details:" -ForegroundColor Cyan
    Write-Host "   Location: $($apk.FullName)" -ForegroundColor White
    Write-Host "   Size: $sizeInMB MB" -ForegroundColor White
    Write-Host "   Created: $($apk.LastWriteTime)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "📱 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Test APK: adb install $($apk.FullName)" -ForegroundColor White
    Write-Host "   2. Test on multiple devices" -ForegroundColor White
    Write-Host "   3. Upload to GitHub Releases" -ForegroundColor White
    Write-Host "   4. Share download link" -ForegroundColor White
    Write-Host ""
    
    # Open folder
    $openFolder = Read-Host "Open APK folder? (Y/n)"
    if ($openFolder -ne "n") {
        explorer "android\app\build\outputs\apk\release"
    }
    
} else {
    Write-Host "❌ BUILD FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check the error messages above." -ForegroundColor Yellow
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "   - Incorrect keystore password" -ForegroundColor White
    Write-Host "   - Missing keystore file" -ForegroundColor White
    Write-Host "   - Gradle configuration errors" -ForegroundColor White
    Write-Host ""
    Write-Host "Try running with --stacktrace:" -ForegroundColor Yellow
    Write-Host "   cd android; .\gradlew.bat assembleRelease --stacktrace" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "🎉 APK Build Complete!" -ForegroundColor Green