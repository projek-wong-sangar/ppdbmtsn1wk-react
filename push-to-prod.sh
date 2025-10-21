#!/bin/bash

# Pastikan ada argumen pesan commit
if [ -z "$1" ]; then
  echo "Usage: ./push-to-prod.sh \"Your custom commit message\""
  exit 1
fi

COMMIT_MSG=$1

# Switch ke prod
git checkout prod

# Reset isi prod agar sama dengan main (copy file, bukan commit history)
git checkout main -- .

# Commit perubahan dengan pesan custom
git add .
git commit -m "$COMMIT_MSG"

# Force push ke remote prod
git push -f origin prod

echo "Production branch has been updated with custom commit message: $COMMIT_MSG"

# Balik lagi ke main
git checkout main
