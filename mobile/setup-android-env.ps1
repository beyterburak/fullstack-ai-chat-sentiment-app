# 🚀 Android Environment Kurulum Scripti
# Bu script ANDROID_HOME ve PATH değişkenlerini ayarlar

Write-Host "🔧 Android Environment Ayarlanıyor..." -ForegroundColor Cyan
Write-Host ""

# Android SDK yolu
$androidSdk = "C:\Users\beyte\AppData\Local\Android\Sdk"

# SDK'nın var olduğunu kontrol et
if (!(Test-Path $androidSdk)) {
    Write-Host "❌ HATA: Android SDK bulunamadı!" -ForegroundColor Red
    Write-Host "   Beklenen konum: $androidSdk" -ForegroundColor Yellow
    Write-Host "   Lütfen önce Android Studio'yu kurun." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Android SDK bulundu: $androidSdk" -ForegroundColor Green

# ANDROID_HOME'u ayarla (Machine level - requires admin)
try {
    Write-Host "📝 ANDROID_HOME ayarlanıyor..." -ForegroundColor Yellow
    [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdk, "Machine")
    Write-Host "✅ ANDROID_HOME ayarlandı!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  ANDROID_HOME otomatik ayarlanamadı (Admin gerekli)" -ForegroundColor Yellow
    Write-Host "   Manuel olarak ayarlayın veya scripti admin olarak çalıştırın" -ForegroundColor Yellow
}

# PATH'e eklenecek yollar
$pathsToAdd = @(
    "$androidSdk\platform-tools",
    "$androidSdk\emulator",
    "$androidSdk\tools",
    "$androidSdk\tools\bin"
)

# Mevcut PATH'i al
try {
    Write-Host "📝 PATH güncelleniyor..." -ForegroundColor Yellow
    $currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    
    $updated = $false
    foreach ($path in $pathsToAdd) {
        if ($currentPath -notlike "*$path*") {
            Write-Host "   Ekleniyor: $path" -ForegroundColor Cyan
            $currentPath += ";$path"
            $updated = $true
        } else {
            Write-Host "   Zaten var: $path" -ForegroundColor Gray
        }
    }
    
    if ($updated) {
        [System.Environment]::SetEnvironmentVariable("Path", $currentPath, "Machine")
        Write-Host "✅ PATH güncellendi!" -ForegroundColor Green
    } else {
        Write-Host "✅ PATH zaten güncel!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  PATH otomatik güncellenemedi (Admin gerekli)" -ForegroundColor Yellow
    Write-Host "   Manuel olarak ekleyin veya scripti admin olarak çalıştırın" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ KURULUM TAMAMLANDI!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 SONRAKI ADIMLAR:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. VS Code'u TAMAMEN KAPATIP TEKRAR AÇIN" -ForegroundColor White
Write-Host "   (Environment değişkenleri için gerekli)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Yeni terminal'de doğrulayın:" -ForegroundColor White
Write-Host '   $env:ANDROID_HOME' -ForegroundColor Cyan
Write-Host "   adb version" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Emulator oluşturun veya cihaz bağlayın" -ForegroundColor White
Write-Host ""
Write-Host "4. Uygulamayı çalıştırın:" -ForegroundColor White
Write-Host "   cd mobile" -ForegroundColor Cyan
Write-Host "   npm run android" -ForegroundColor Cyan
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Not: local.properties dosyası da oluşturuldu (yedek çözüm)" -ForegroundColor Gray
Write-Host ""
