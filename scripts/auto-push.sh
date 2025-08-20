#!/bin/bash

# Auto-push script for harmonized-trainer
# This script automatically commits and pushes changes to GitHub

set -e  # Exit on any error

echo "🤖 Starting auto-push process..."

# Check if there are any changes to commit
if git diff-index --quiet HEAD --; then
    echo "✅ No changes to commit"
    exit 0
fi

# Get current timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Add all changes
echo "📁 Adding all changes..."
git add .

# Commit with timestamp
echo "💾 Committing changes..."
git commit -m "Auto-push: $TIMESTAMP - $(git diff --cached --name-only | head -3 | tr '\n' ' ' | sed 's/ $//')"

# Push to remote
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Successfully pushed to GitHub!"
echo "📅 Timestamp: $TIMESTAMP"
