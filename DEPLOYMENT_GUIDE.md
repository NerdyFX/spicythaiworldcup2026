# Spicy Thai World Cup App - Deployment Guide

## Phase 1: Upload to GitHub

1. **Create a GitHub Account:** Go to [github.com](https://github.com) and sign up if you haven't already.
2. **New Repository:**
   - Click the **"+"** icon in the top right and select **"New repository"**.
   - Name it: `spicy-thai-world-cup`.
   - Keep it **Public** (required for the free tier on most hosting sites).
   - Click **"Create repository"**.
3. **Connect your computer to GitHub:**
   In your terminal (the same one we used to build the app), run these commands one by one:

```bash
# Go into the project folder
cd world-cup-app

# Initialize Git
git init

# Add all files
git add .

# Save the files locally
git commit -m "Initial commit of Spicy Thai World Cup App"

# Link to your new GitHub repo (Replace YOUR_USERNAME with your actual GitHub name)
git remote add origin https://github.com/YOUR_USERNAME/spicy-thai-world-cup.git

# Upload to GitHub
git branch -M main
git push -u origin main
```

*Note: GitHub might ask you to log in or use a "Personal Access Token" the first time you push.*

---

## Phase 2: Deploy to Render

1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub account and select the **spicy-thai-world-cup** repository.
4. Use these settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. **Environment Variables:**
   - Click "Advanced" or scroll to find "Environment Variables".
   - Add **Key:** `MONGODB_URI`
   - Add **Value:** (Your MongoDB connection string).
6. Click **Create Web Service**.

Once Render finishes (about 3-5 mins), you will have your live link!
