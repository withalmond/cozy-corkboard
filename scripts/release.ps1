# Cozy Corkboard — build and zip for Windows release
# Usage: npm run release

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
$version = $pkg.version
$appFolder = "cozy corkboard-win32-x64"
$zipName = "cozy-corkboard-v$version-win-x64.zip"

Write-Host ""
Write-Host "  Cozy Corkboard release prep" -ForegroundColor Cyan
Write-Host "  Version: $version" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Building production app..." -ForegroundColor Yellow
npm run electron:build
if ($LASTEXITCODE -ne 0) { throw "electron:build failed" }

$sourceDir = Join-Path (Join-Path $Root "release") $appFolder
if (-not (Test-Path (Join-Path $sourceDir "cozy corkboard.exe"))) {
    throw "Expected exe not found at release\$appFolder\cozy corkboard.exe"
}

Write-Host "[2/3] Creating zip..." -ForegroundColor Yellow
$zipPath = Join-Path (Join-Path $Root "release") $zipName
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path $sourceDir -DestinationPath $zipPath -CompressionLevel Optimal

Write-Host "[3/3] Done!" -ForegroundColor Green
Write-Host ""
Write-Host "  Folder: release\$appFolder" -ForegroundColor White
Write-Host "  Zip:    release\$zipName" -ForegroundColor White
Write-Host ""
Write-Host "  Next steps:" -ForegroundColor Cyan
Write-Host "    1. Test:  Start-Process `"release\$appFolder\cozy corkboard.exe`""
Write-Host "    2. Push:  git push origin main"
Write-Host "    3. Release:"
Write-Host "       gh release create v$version `"release\$zipName`" --title `"Cozy Corkboard v$version`""
Write-Host ""
