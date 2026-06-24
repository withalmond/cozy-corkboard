# Cozy Corkboard - build and zip for Windows release
# Usage: npm run release

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
$version = $pkg.version
$builtFolder = "cozy corkboard-win32-x64"
$exeName = "click to run.exe"
$zipFolderName = "Cozy Corkboard"
$zipName = "cozy-corkboard-v$version-win-x64.zip"

Write-Host ""
Write-Host "  Cozy Corkboard release prep" -ForegroundColor Cyan
Write-Host "  Version: $version" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Building production app..." -ForegroundColor Yellow
npm run electron:build:win
if ($LASTEXITCODE -ne 0) { throw "electron:build:win failed" }

$builtDir = Join-Path (Join-Path $Root "release") $builtFolder
if (-not (Test-Path (Join-Path $builtDir $exeName))) {
    throw "Expected exe not found at release\$builtFolder\$exeName"
}

Write-Host "[2/4] Staging friendly download folder..." -ForegroundColor Yellow
$stageRoot = Join-Path (Join-Path $Root "release") "_zip"
$stageDir = Join-Path $stageRoot $zipFolderName
if (Test-Path $stageRoot) { Remove-Item $stageRoot -Recurse -Force }
New-Item -ItemType Directory -Path $stageDir -Force | Out-Null
Copy-Item -Path (Join-Path $builtDir "*") -Destination $stageDir -Recurse -Force

$installTxt = Get-Content (Join-Path $Root "scripts\START-HERE-windows.txt") -Raw
Set-Content -Path (Join-Path $stageDir "START HERE.txt") -Value $installTxt.TrimEnd() -Encoding UTF8

Write-Host "[3/4] Creating zip..." -ForegroundColor Yellow
$zipPath = Join-Path (Join-Path $Root "release") $zipName
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path $stageDir -DestinationPath $zipPath -CompressionLevel Optimal

Write-Host "[4/4] Cleaning staging files..." -ForegroundColor Yellow
Remove-Item $stageRoot -Recurse -Force

Write-Host ""
Write-Host "  Done!" -ForegroundColor Green
Write-Host "  Zip:     release\$zipName" -ForegroundColor White
Write-Host "  Inside:  $zipFolderName\click to run.exe" -ForegroundColor White
Write-Host ""
Write-Host "  Test: Start-Process `"release\$builtFolder\$exeName`"" -ForegroundColor Cyan
Write-Host ""
