# Vercel Deployment Instructions

## Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Code pushed to GitHub repository: https://github.com/matthewanthony777/teamprofilehub

## Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/matthewanthony777/teamprofilehub.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository (teamprofilehub)
4. Vercel auto-detects Vite settings
5. Click "Deploy"
6. Wait 2-3 minutes for deployment
7. Your app is live!

### 3. Your Live URL
Vercel will provide a URL like: https://teamprofilehub.vercel.app

## Post-Deployment
- Test all features on live site
- Enable Director Mode and add data
- Share URL with team

## Updates
After making changes:
```bash
git add .
git commit -m "Description of changes"
git push
```
Vercel automatically redeploys on every push!

## Optional: Add Vercel KV Database
For shared data across users:
1. In Vercel dashboard → Storage → Create KV Database
2. Redeploy project
3. Data now shared across all users
