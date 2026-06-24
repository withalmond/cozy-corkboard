# Publish Cozy Corkboard to GitHub (repo + release)
# Prerequisite: gh auth login (one time)
# Mac zip is built on GitHub Actions — run workflow or tag v* for both platforms.

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

Write-Host ""
Write-Host "  Cozy Corkboard - GitHub publish" -ForegroundColor Cyan
Write-Host ""

$prevEAP = $ErrorActionPreference
$ErrorActionPreference = "Continue"
gh auth status *>$null
$loggedIn = ($LASTEXITCODE -eq 0)
$ErrorActionPreference = $prevEAP

if (-not $loggedIn) {
    Write-Host "  Opening GitHub login in your browser (one-time)..." -ForegroundColor Yellow
    gh auth login --hostname github.com --git-protocol https --web
    if ($LASTEXITCODE -ne 0) { throw "GitHub login failed or was cancelled" }
}

$pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
$version = $pkg.version
$winZipName = "cozy-corkboard-v$version-win-x64.zip"
$macZipName = "cozy-corkboard-v$version-mac-universal.zip"
$winZipPath = Join-Path (Join-Path $Root "release") $winZipName
$macZipPath = Join-Path (Join-Path $Root "release") $macZipName

if (-not (Test-Path $winZipPath)) {
    Write-Host "  Windows zip not found - building..." -ForegroundColor Yellow
    npm run release:win
    if ($LASTEXITCODE -ne 0) { throw "release:win failed" }
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
Write-Host "  Tip: For Mac + Windows together, push tag v$version or run Actions -> Build Release" -ForegroundColor Cyan

$prevEAP = $ErrorActionPreference
$ErrorActionPreference = "Continue"
gh release view "v$version" *>$null
$releaseExists = ($LASTEXITCODE -eq 0)
$ErrorActionPreference = $prevEAP

$notes = @"
## Windows
1. Download $winZipName
2. Unzip the Cozy Corkboard folder
3. Double-click click to run
SmartScreen? More info, then Run anyway.

## Mac (Ventura and newer)
1. Download $macZipName (from GitHub Actions if not listed yet)
2. Unzip the Cozy Corkboard folder
3. Double-click click to run
Gatekeeper? Right-click, Open, Open.

Each person gets their own private board - data stays on your device.
"@

$assets = @($winZipPath)
if (Test-Path $macZipPath) { $assets += $macZipPath }

if ($releaseExists) {
    Write-Host "  Release v$version already exists - uploading assets..." -ForegroundColor Yellow
    foreach ($asset in $assets) {
        gh release upload "v$version" $asset --clobber
        if ($LASTEXITCODE -ne 0) { throw "gh release upload failed for $asset" }
    }
} else {
    gh release create "v$version" @assets --title "Cozy Corkboard v$version" --notes $notes
    if ($LASTEXITCODE -ne 0) { throw "gh release create failed" }
}

$url = gh repo view --json url -q .url
Write-Host ""
Write-Host "  Done!" -ForegroundColor Green
Write-Host "  Repo:     $url" -ForegroundColor White
Write-Host "  Releases: $url/releases" -ForegroundColor White
Write-Host "  Windows:  release\$winZipName" -ForegroundColor White
if (Test-Path $macZipPath) {
    Write-Host "  Mac:      release\$macZipName" -ForegroundColor White
} else {
    Write-Host "  Mac:      run GitHub Actions 'Build Release' for the Mac zip" -ForegroundColor Yellow
}
Write-Host ""
