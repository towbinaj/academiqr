# Git Repository Setup Guide

## Step 1: Install Git

### For Windows:
1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/PowerShell after installation

### Verify Installation:
```bash
git --version
```

## Step 2: Initialize Git Repository

After installing Git, run these commands in your project directory:

```bash
# Initialize the repository
git init

# Configure your Git identity (replace with your info)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Make initial commit
git add .
git commit -m "Initial commit: AcademiQR v0.4.1"
```

## Step 3: Create a Remote Repository (Optional)

If you want to push to GitHub/GitLab:

1. Create a new repository on GitHub/GitLab
2. Add the remote:
   ```bash
   git remote add origin https://github.com/yourusername/academiqr.git
   git branch -M main
   git push -u origin main
   ```

## Step 4: Using Automated Versioning

After setup, use the version scripts:

```bash
# Bump patch version (0.4.1 -> 0.4.2)
npm run version:patch

# Bump minor version (0.4.1 -> 0.5.0)
npm run version:minor

# Bump major version (0.4.1 -> 1.0.0)
npm run version:major
```

These scripts will:
- Update version in `package.json`
- Update version in `index.html` and `public.html`
- Create a git commit
- Create a git tag
- Show next steps


