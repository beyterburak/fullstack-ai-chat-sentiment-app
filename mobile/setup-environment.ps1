# Java & Android Environment Setup Script
# Run this as Administrator

Write-Host "🔧 Setting up Java and Android Environment Variables..." -ForegroundColor Cyan
Write-Host ""

# 1. Set JAVA_HOME
$javaHome = "C:\Program Files\Eclipse Adoptium\jdk-11.0.28.6-hotspot"

Write-Host "1️⃣ Setting JAVA_HOME..." -ForegroundColor Yellow
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $javaHome, 'Machine')
Write-Host "   ✅ JAVA_HOME = $javaHome" -ForegroundColor Green

# 2. Add Java to PATH
Write-Host ""
Write-Host "2️⃣ Adding Java to PATH..." -ForegroundColor Yellow
$path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')

# Remove old Java paths if any
$path = ($path -split ';' | Where-Object { $_ -notlike "*Java*" -and $_ -notlike "*javapath*" }) -join ';'

# Add new Java path
$newPath = $path + ";$javaHome\bin"
[System.Environment]::SetEnvironmentVariable('Path', $newPath, 'Machine')
Write-Host "   ✅ Added $javaHome\bin to PATH" -ForegroundColor Green

# 3. Set ANDROID_HOME (if Android SDK exists)
Write-Host ""
Write-Host "3️⃣ Checking Android SDK..." -ForegroundColor Yellow
$androidSdk = "$env:LOCALAPPDATA\Android\Sdk"

if (Test-Path $androidSdk) {
    Write-Host "   ✅ Android SDK found at: $androidSdk" -ForegroundColor Green
    
    [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $androidSdk, 'Machine')
    Write-Host "   ✅ ANDROID_HOME set" -ForegroundColor Green
    
    # Add Android tools to PATH
    $androidPaths = @(
        "$androidSdk\platform-tools",
        "$androidSdk\emulator",
        "$androidSdk\tools",
        "$androidSdk\tools\bin"
    )
    
    $path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
    foreach ($androidPath in $androidPaths) {
        if ($path -notlike "*$androidPath*") {
            $path += ";$androidPath"
        }
    }
    [System.Environment]::SetEnvironmentVariable('Path', $path, 'Machine')
    Write-Host "   ✅ Added Android tools to PATH" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Android SDK not found. Install Android Studio first." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Environment variables set successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   JAVA_HOME = $javaHome"
Write-Host "   ANDROID_HOME = $androidSdk"
Write-Host ""
Write-Host "⚠️  IMPORTANT: Close and reopen PowerShell for changes to take effect!" -ForegroundColor Yellow
Write-Host ""
Write-Host "After reopening PowerShell, verify with:" -ForegroundColor Cyan
Write-Host "   java -version" -ForegroundColor White
Write-Host "   echo `$env:JAVA_HOME" -ForegroundColor White
Write-Host "   adb version" -ForegroundColor White
Write-Host ""