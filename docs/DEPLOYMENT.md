# SQC Employee Hub - Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the SQC Employee Hub to Vercel.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Deployment Steps](#deployment-steps)
- [Configuration](#configuration)
- [Post-Deployment Testing](#post-deployment-testing)
- [Troubleshooting](#troubleshooting)
- [Custom Domain Setup](#custom-domain-setup)

---

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Account** (or GitLab/Bitbucket)
   - Create an account at https://github.com if you don't have one

2. **Vercel Account**
   - Sign up at https://vercel.com
   - Connect your GitHub account to Vercel

3. **Git Installed**
   - Check by running: `git --version`
   - Download from https://git-scm.com if needed

4. **Node.js Installed** (v18 or higher)
   - Check by running: `node --version`
   - Download from https://nodejs.org if needed

---

## Deployment Steps

### Step 1: Prepare Your Repository

1. **Initialize Git Repository** (if not already done)
   ```bash
   cd "sqc employee database"
   git init
   ```

2. **Create .gitignore** (if not exists)
   ```bash
   echo "node_modules/
   dist/
   .DS_Store
   .env
   .env.local
   *.log" > .gitignore
   ```

3. **Commit Your Code**
   ```bash
   git add .
   git commit -m "Initial commit - SQC Employee Hub ready for deployment"
   ```

4. **Create GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `sqc-employee-hub`
   - Description: "SQC Employee Database and Analytics Hub"
   - Set to **Private** (recommended for company data)
   - Click "Create repository"

5. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sqc-employee-hub.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Login to Vercel**
   - Go to https://vercel.com
   - Click "Login" and sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find your `sqc-employee-hub` repository
   - Click "Import"

3. **Configure Project**
   - **Project Name**: `sqc-employee-hub` (or your preferred name)
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should be pre-filled)
   - **Output Directory**: `dist` (should be pre-filled)
   - **Install Command**: `npm install` (should be pre-filled)

4. **Environment Variables** (if any)
   - Click "Environment Variables" section
   - Add any required variables (see .env.example)
   - For this project, none are required by default

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll see a success screen with your deployment URL

6. **Your App is Live!**
   - Vercel will provide a URL like: `https://sqc-employee-hub.vercel.app`
   - Click "Visit" to see your deployed application

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd "sqc employee database"
   vercel
   ```

4. **Follow Prompts**
   - Set up and deploy: `Y`
   - Scope: Select your account
   - Link to existing project: `N`
   - Project name: `sqc-employee-hub`
   - Directory: `./`
   - Override settings: `N`

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

---

### Step 3: Verify Deployment

1. **Visit Your Deployment URL**
   - Open the provided URL in your browser
   - Example: `https://sqc-employee-hub.vercel.app`

2. **Check Console for Errors**
   - Open browser DevTools (F12 or Cmd+Option+I)
   - Check Console tab for any errors
   - Should see no critical errors

3. **Test Core Features** (see Post-Deployment Testing section below)

---

## Configuration

### vercel.json

The project includes a `vercel.json` file with the following configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures:
- Vite builds correctly
- Single Page Application (SPA) routing works
- All routes redirect to index.html for client-side routing

### Build Configuration

The build process:
1. Runs `npm install` to install dependencies
2. Runs `npm run build` to create production bundle
3. Outputs to `dist/` directory
4. Serves static files from `dist/`

### Automatic Deployments

Once connected to GitHub:
- **Every push to `main` branch** triggers automatic production deployment
- **Pull requests** create preview deployments
- **Rollback** available from Vercel dashboard

---

## Post-Deployment Testing

Follow this checklist after deployment:

### 1. Core Functionality
- [ ] Application loads without errors
- [ ] Dashboard displays correctly
- [ ] Navigation between tabs works

### 2. Employee Management
- [ ] Can add new employees
- [ ] Can edit existing employees
- [ ] Can delete employees (with confirmation)
- [ ] Can search/filter employees
- [ ] Employee profiles display correctly

### 3. Skills Management
- [ ] Can add new skills to catalog
- [ ] Can assign skills to employees with proficiency levels
- [ ] Skill badges display correctly
- [ ] Can remove skills

### 4. Education Management
- [ ] Can add education entries to employees
- [ ] Only education level is required (other fields optional)
- [ ] Education badges display correctly
- [ ] Can remove education entries

### 5. Timeline Features
- [ ] Can add timeline entries with date pickers
- [ ] Status dropdown works (Completed/In Progress/On Hold)
- [ ] Tags can be added and removed
- [ ] Overlap detection works and shows warnings
- [ ] Timeline displays with correct colors and formatting
- [ ] Concurrent project indicators appear

### 6. Analytics Dashboard
- [ ] Skills Distribution chart displays
- [ ] Proficiency Breakdown chart displays
- [ ] Top 10 Skills chart displays
- [ ] Education Distribution chart displays (shows real data)
- [ ] Department Composition displays
- [ ] Skills Gap Analysis displays
- [ ] Can filter by department
- [ ] Export Analytics to CSV works

### 7. Data Persistence
- [ ] Data persists after page refresh
- [ ] LocalStorage is working correctly
- [ ] Can clear data and re-seed if needed

### 8. Export Functionality
- [ ] Export Employees to CSV works
- [ ] Export Analytics to CSV works
- [ ] Files download correctly

### 9. Mobile Responsiveness
- [ ] Test on mobile device (or DevTools mobile view)
- [ ] Navigation menu works on mobile
- [ ] Forms are usable on mobile
- [ ] Charts display correctly on mobile
- [ ] Tables are scrollable on mobile

### 10. Performance
- [ ] Page loads quickly (< 3 seconds)
- [ ] No console errors
- [ ] Smooth animations and transitions
- [ ] Charts render without lag

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module..."**
- Solution: Ensure all dependencies are in `package.json`
- Run `npm install` locally and test `npm run build`

**Error: "Build failed with exit code 1"**
- Solution: Check Vercel build logs for specific error
- Common issues: missing files, import errors, syntax errors

### Application Doesn't Load

**Blank page after deployment**
- Check browser console for errors
- Verify `vercel.json` has correct SPA rewrites
- Check Vercel deployment logs

**404 errors on page refresh**
- Ensure `vercel.json` includes rewrites configuration
- Vercel should serve `index.html` for all routes

### Data Not Persisting

**LocalStorage not working**
- Check browser privacy settings
- Ensure no browser extensions blocking storage
- Try in incognito/private mode

**Data lost after deployment**
- LocalStorage is browser-specific and client-side
- Each user will have their own data
- Data won't transfer between browsers or devices

### Performance Issues

**Slow loading**
- Check Vercel Analytics for performance metrics
- Optimize images if added
- Consider lazy loading for charts

**Charts not rendering**
- Check for console errors
- Verify Recharts library is installed
- Test in different browsers

---

## Custom Domain Setup

### Add Custom Domain (Optional)

1. **Access Domains Settings**
   - Go to your project in Vercel dashboard
   - Click "Settings" → "Domains"

2. **Add Domain**
   - Click "Add Domain"
   - Enter your domain: `employees.sqc.com` (example)
   - Click "Add"

3. **Configure DNS**
   - Follow Vercel's DNS configuration instructions
   - Add A record or CNAME record as specified
   - Wait for DNS propagation (can take up to 48 hours)

4. **SSL Certificate**
   - Vercel automatically provisions SSL certificate
   - Your site will be accessible via HTTPS

---

## Updating Your Deployment

### Make Changes

1. **Edit Code Locally**
   ```bash
   # Make your changes
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

2. **Automatic Deployment**
   - Vercel detects push to main branch
   - Automatically builds and deploys
   - Check deployment status in Vercel dashboard

### Rollback Deployment

1. **Access Deployments**
   - Go to Vercel dashboard
   - Click "Deployments" tab

2. **Rollback**
   - Find the previous working deployment
   - Click "..." menu → "Promote to Production"
   - Instant rollback to that version

---

## Environment Variables (Future Use)

If you need to add environment variables in the future:

1. **Local Development**
   - Create `.env.local` file
   - Add variables: `VITE_API_URL=https://api.example.com`
   - Access in code: `import.meta.env.VITE_API_URL`

2. **Vercel Dashboard**
   - Go to Settings → Environment Variables
   - Add variables for Production, Preview, and Development
   - Redeploy for changes to take effect

---

## Support and Resources

### Vercel Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Deploying Vite Apps](https://vercel.com/guides/deploying-vite-to-vercel)
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)

### SQC Employee Hub Resources
- [README.md](../README.md) - Project overview and local setup
- [POST_DEPLOYMENT_CHECKLIST.md](./POST_DEPLOYMENT_CHECKLIST.md) - Detailed testing checklist

### Getting Help
- Check Vercel build logs for deployment errors
- Review browser console for runtime errors
- Contact Vercel support for platform-specific issues

---

## Success Criteria

Your deployment is successful when:

✅ Application is accessible via Vercel URL
✅ No console errors on page load
✅ All core features work as expected
✅ Data persists in localStorage
✅ Mobile responsive design works
✅ Analytics charts display real data
✅ CSV exports download correctly
✅ Timeline overlap detection works
✅ Automatic deployments configured

---

**Deployment Complete!** 🚀

Your SQC Employee Hub is now live and accessible to your team.
