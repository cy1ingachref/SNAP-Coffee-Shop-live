#!/usr/bin/env bash
# deploy.sh — deploy SNAP-Coffee-Shop to GitHub Pages.
# Run this AFTER you've authenticated to GitHub (see instructions).
# Usage: bash deploy.sh <your-github-username> <repo-name>
set -euo pipefail

USER="${1:-}"
REPO="${2:-SNAP-Coffee-Shop}"
DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -z "$USER" ]; then
  echo "Usage: bash deploy.sh <github-username> [repo-name]"
  exit 1
fi

cd "$DIR"
git init -q 2>/dev/null || true
git config user.name "SNAP Coffee Shop" 2>/dev/null || true
git config user.email "snap@coffee.local" 2>/dev/null || true

# create repo via gh (requires gh auth login first)
if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI not found. Install it: https://cli.github.com/"
  exit 1
fi
gh auth status >/dev/null 2>&1 || { echo "ERROR: not authenticated. Run: gh auth login"; exit 1; }

gh repo create "$USER/$REPO" --public --source=. --push --description "SNAP Coffee Shop — static site" 2>/dev/null || \
  git remote set-url origin "https://github.com/$USER/$REPO.git" && git push -u origin main

# enable GitHub Pages (served from main branch, root)
gh api -X POST "/repos/$USER/$REPO/pages" -f source='{"branch":"main","path":"/"}' 2>/dev/null || \
  echo "NOTE: Pages may need to be enabled manually in repo Settings > Pages."

echo ""
echo "Done. Your site will be live at: https://$USER.github.io/$REPO/"
echo "QR code generation can be done with: python -m qrcode 'https://$USER.github.io/$REPO/'"
