# Publish Cozy Corkboard to GitHub (repo + release)
# Prerequisite: gh auth login (one time)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

Write-Host ""
Write-Host "  Cozy Corkboard — GitHub publish" -ForegroundColor Cyan
Write-Host ""

# Check gh auth
$authCheck = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  GitHub CLI is not logged in." -ForegroundColor Red
    Write-Host "  Run this first, then run this script again:" -ForegroundColor Yellow
    Write-Host "    gh auth login" -ForegroundColor White
    Write-Host ""
    exit 1
}

$pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
$version = $pkg.version
$zipName = "cozy-corkboard-v$version-win-x64.zip"
$zipPath = Join-Path (Join-Path $Root "release") $zipName

if (-not (Test-Path $zipPath)) {
    Write-Host "  Zip not found — building release first..." -ForegroundColor Yellow
    npm run release
    if ($LASTEXITCODE -ne 0) { throw "release build failed" }
}

$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "[1/2] Creating public repo and pushing..." -ForegroundColor Yellow
    gh repo create cozy-corkboard --public --source=. --push
    if ($LASTEXITCODE -ne 0) { throw "gh repo create failed" }
} else {
    Write-Host "[1/2] Remote exists ($remote) — pushing main..." -ForegroundColor Yellow
    git push -u origin main
    if ($LASTEXITCODE -ne 0) { throw "git push failed" }
}

Write-Host "[2/2] Creating GitHub release v$version..." -ForegroundColor Yellow
$existing = gh release view "v$version" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Release v$version already exists — uploading asset..." -ForegroundColor Yellow
    gh release upload "v$version" $zipPath --clobber
} else {
    gh release create "v$version" $zipPath `
        --title "Cozy Corkboard v$version" `
        --notes "## Install (Windows)`n`n1. Download **$zipName** below`n2. Unzip anywhere`n3. Run **cozy corkboard.exe**`n`nIf Windows SmartScreen appears: **More info** → **Run anyway.**`n`nEach person gets their own private board — data stays on your PC."
    if ($LASTEXITCODE -ne 0) { throw "gh release create failed" }
}

$url = gh repo view --json url -q .url
Write-Host ""
Write-Host "  Done!" -ForegroundColor Green
Write-Host "  Repo:     $url" -ForegroundColor White
Write-Host "  Releases: $url/releases" -ForegroundColor White
Write-Host "  Zip:      release\$zipName" -ForegroundColor White
Write-Host ""
Write-Host "  Or upload release\$zipName to Google Drive for the same install experience." -ForegroundColor Cyan
Write-Host ""
