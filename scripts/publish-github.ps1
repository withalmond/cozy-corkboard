# Publish Cozy Corkboard to GitHub (repo + release)
# Prerequisite: gh auth login (one time)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

Write-Host ""
Write-Host "  Cozy Corkboard - GitHub publish" -ForegroundColor Cyan
Write-Host ""

gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Opening GitHub login in your browser (one-time)..." -ForegroundColor Yellow
    gh auth login --hostname github.com --git-protocol https --web
    if ($LASTEXITCODE -ne 0) { throw "GitHub login failed or was cancelled" }
}

$pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
$version = $pkg.version
$zipName = "cozy-corkboard-v$version-win-x64.zip"
$zipPath = Join-Path (Join-Path $Root "release") $zipName

if (-not (Test-Path $zipPath)) {
    Write-Host "  Zip not found - building release first..." -ForegroundColor Yellow
    npm run release
    if ($LASTEXITCODE -ne 0) { throw "release build failed" }
}

$remote = $null
try { $remote = git remote get-url origin 2>$null } catch { $remote = $null }

if (-not $remote) {
    Write-Host "[1/2] Creating public repo and pushing..." -ForegroundColor Yellow
    gh repo create cozy-corkboard --public --source=. --push
    if ($LASTEXITCODE -ne 0) { throw "gh repo create failed" }
} else {
    Write-Host "[1/2] Remote exists ($remote) - pushing main..." -ForegroundColor Yellow
    git push -u origin main
    if ($LASTEXITCODE -ne 0) { throw "git push failed" }
}

Write-Host "[2/2] Creating GitHub release v$version..." -ForegroundColor Yellow
gh release view "v$version" 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Release v$version already exists - uploading asset..." -ForegroundColor Yellow
    gh release upload "v$version" $zipPath --clobber
    if ($LASTEXITCODE -ne 0) { throw "gh release upload failed" }
} else {
    $notes = @"
## Install (Windows)

1. Download $zipName below
2. Unzip anywhere
3. Run cozy corkboard.exe

If Windows SmartScreen appears: More info, then Run anyway.

Each person gets their own private board - data stays on your PC.
"@
    gh release create "v$version" $zipPath --title "Cozy Corkboard v$version" --notes $notes
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
