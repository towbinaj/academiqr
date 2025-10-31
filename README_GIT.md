# Git Repository & Version Management

This guide explains how to use Git and automated versioning for AcademiQR.

## Quick Start

### 1. Install Git

**Windows:**
- Download from: https://git-scm.com/download/win
- Run installer with default settings
- Restart your terminal

**Verify installation:**
```bash
git --version
```

### 2. Initialize Repository

**Option A: Using the automated script (Windows)**
```bash
scripts\init-git.bat
```

**Option B: Manual setup**
```bash
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
git add .
git commit -m "Initial commit: AcademiQR v0.4.1"
```

### 3. Using Automated Versioning

The project includes automated version bumping that updates:
- `package.json`
- `index.html` (title and version references)
- `public.html` (title and version references)
- `CHANGELOG.md` (automatically adds entry)

#### Bump Patch Version (Bug fixes)
```bash
npm run version:patch
# 0.4.1 -> 0.4.2
```

#### Bump Minor Version (New features)
```bash
npm run version:minor
# 0.4.1 -> 0.5.0
```

#### Bump Major Version (Breaking changes)
```bash
npm run version:major
# 0.4.1 -> 1.0.0
```

#### After Version Bump

The script will show you the next steps. Typically:
```bash
# Review changes
git diff

# Commit the version bump
git add -A
git commit -m "chore: bump version to X.X.X"

# Create a tag
git tag -a vX.X.X -m "Version X.X.X"

# Push to remote (if configured)
git push
git push --tags
```

## Git Workflow

### Daily Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Or stage specific files
git add index.html package.json

# Commit with descriptive message
git commit -m "feat: add new feature description"

# Push to remote
git push
```

### Commit Message Convention

Use conventional commit messages:
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance (version bumps, config changes)
- `docs:` - Documentation changes
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code restructuring
- `perf:` - Performance improvements

Examples:
```bash
git commit -m "feat: add Google OAuth authentication"
git commit -m "fix: resolve link loading performance issue"
git commit -m "chore: update dependencies"
```

### Branching (Optional)

For larger features:
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: implement new feature"

# Switch back to main
git checkout main

# Merge feature
git merge feature/new-feature

# Delete feature branch
git branch -d feature/new-feature
```

## Remote Repository Setup

### Connect to GitHub

1. Create a new repository on GitHub
2. Add remote:
   ```bash
   git remote add origin https://github.com/yourusername/academiqr.git
   git branch -M main
   git push -u origin main
   ```

### Connect to GitLab

1. Create a new project on GitLab
2. Add remote:
   ```bash
   git remote add origin https://gitlab.com/yourusername/academiqr.git
   git branch -M main
   git push -u origin main
   ```

## Files Included in Repository

The `.gitignore` file excludes:
- `node_modules/` - Dependencies (installed via npm)
- `.env` files - Environment variables (sensitive data)
- Build outputs - `dist/`, `build/`
- IDE files - `.vscode/`, `.idea/`
- OS files - `.DS_Store`, `Thumbs.db`
- Temporary/log files

**Important:** Never commit:
- `.env` files with API keys
- Private keys (`.key`, `.pem` files)
- Database passwords
- Supabase keys (use environment variables)

## Version History

See `CHANGELOG.md` for detailed version history.

## Troubleshooting

### Git not recognized
- Restart terminal after installing Git
- Check Git is in PATH: `where git`

### Version bump fails
- Ensure Node.js is installed: `node --version`
- Run from project root directory
- Check `scripts/version-bump.js` exists

### Commit rejected
- Check Git configuration: `git config --list`
- Verify remote repository exists
- Check branch name matches remote


