#!/bin/bash
set -euo pipefail

SITE_DIR="/Users/richj/.openclaw/workspace/projects/bestaiassistantapp-site"
DEPLOY_REPO_DIR="/Users/richj/.openclaw/workspace/.tmp/bestaiassistantapp-site-repo"
REPO_URL="https://github.com/rmacmini2026-ai/bestaiassistantapp-site.git"

mkdir -p "$(dirname "$DEPLOY_REPO_DIR")"

if [ ! -d "$DEPLOY_REPO_DIR/.git" ]; then
  rm -rf "$DEPLOY_REPO_DIR"
  git clone "$REPO_URL" "$DEPLOY_REPO_DIR"
fi

cd "$SITE_DIR"
npm run publish:daily

rsync -av --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude 'out' \
  --exclude '.vercel' \
  "$SITE_DIR/" "$DEPLOY_REPO_DIR/" >/tmp/bestaiassistantapp-rsync.log

cd "$DEPLOY_REPO_DIR"

git pull --rebase origin main

if [ -n "$(git status --porcelain)" ]; then
  git add .
  git commit -m "Daily publish $(date +%F)"
  git push origin HEAD:main
  echo "Live publish complete: changes pushed to GitHub main."
else
  echo "Live publish complete: no content changes to push."
fi
