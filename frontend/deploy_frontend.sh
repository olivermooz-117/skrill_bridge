#!/bin/bash

echo "🚀 Deploying SkillBridge Frontend..."

# Step 1: Commit changes
echo "📦 Committing frontend changes..."
git add .
git commit -m "Deploy frontend: $(date +'%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"

# Step 2: Push to GitHub
echo "📡 Pushing frontend to GitHub..."
git push origin main

# Step 3: Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod

echo ""
echo "✅ Frontend deployment complete!"
echo "📍 Your app is live at: https://skrill-bridge-frontend.vercel.app"
