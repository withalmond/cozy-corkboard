#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VERSION="$(node -p "require('./package.json').version")"
BUILT_FOLDER="cozy corkboard-darwin-universal"
APP_NAME="cozy corkboard.app"
ZIP_FOLDER="Cozy Corkboard"
ZIP_NAME="cozy-corkboard-v${VERSION}-mac-universal.zip"

echo ""
echo "  Cozy Corkboard Mac release prep"
echo "  Version: $VERSION"
echo ""

echo "[1/5] Building production app..."
npm run electron:build:mac

BUILT_DIR="$ROOT/release/$BUILT_FOLDER"
if [[ ! -d "$BUILT_DIR/$APP_NAME" ]]; then
  echo "Expected app not found at release/$BUILT_FOLDER/$APP_NAME" >&2
  exit 1
fi

echo "[2/5] Staging friendly download folder..."
STAGE_ROOT="$ROOT/release/_zip"
STAGE_DIR="$STAGE_ROOT/$ZIP_FOLDER"
rm -rf "$STAGE_ROOT"
mkdir -p "$STAGE_DIR"
cp -R "$BUILT_DIR/$APP_NAME" "$STAGE_DIR/click to run.app"

echo "[3/5] Ad-hoc signing (helps Gatekeeper)..."
codesign --force --deep --sign - "$STAGE_DIR/click to run.app" 2>/dev/null || true

echo "[4/5] Adding START HERE.txt..."
cp "$ROOT/scripts/START-HERE-mac.txt" "$STAGE_DIR/START HERE.txt"

echo "[5/5] Creating zip..."
ZIP_PATH="$ROOT/release/$ZIP_NAME"
rm -f "$ZIP_PATH"
(
  cd "$STAGE_ROOT"
  zip -r "$ZIP_PATH" "$ZIP_FOLDER" -x "*.DS_Store"
)
rm -rf "$STAGE_ROOT"

echo ""
echo "  Done!"
echo "  Zip:    release/$ZIP_NAME"
echo "  Inside: $ZIP_FOLDER/click to run.app"
echo ""
