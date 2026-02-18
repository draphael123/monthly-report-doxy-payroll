# Setup Guide

## Permanent Storage Configuration

This app uses a hybrid storage approach:
- **Local Development**: Uses file system (`data/reports.json`)
- **Production (Vercel)**: Uses GitHub API to read/write the data file directly in the repository

### Setting up GitHub Token for Production

1. **Create a GitHub Personal Access Token:**
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name like "Monthly Report App"
   - Select scopes: `repo` (full control of private repositories)
   - Generate and copy the token

2. **Add to Vercel Environment Variables:**
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add new variable:
     - **Name**: `GITHUB_TOKEN`
     - **Value**: Your GitHub personal access token
     - **Environment**: Production (and Preview if desired)
   - Save

3. **Redeploy:**
   - After adding the environment variable, trigger a new deployment
   - The app will now use GitHub API for persistent storage in production

### How It Works

- **Local**: Reads/writes to `data/reports.json` file
- **Production**: 
  - Reads data from GitHub repository via API
  - Writes changes back to GitHub repository via API
  - Data persists across deployments because it's stored in the repo

### Benefits

✅ No external database required  
✅ No additional services to manage  
✅ Data is version-controlled in your GitHub repo  
✅ Works seamlessly in both dev and production  
✅ Free (uses GitHub API which has generous rate limits)

