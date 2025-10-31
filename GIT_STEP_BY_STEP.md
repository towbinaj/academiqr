# Git & Versioning - Complete Step-by-Step Guide

This guide will walk you through every aspect of using Git and versioning for your AcademiQR project.

## Table of Contents
1. [Verify Your Current Setup](#verify-your-current-setup)
2. [Configure Git Identity](#configure-git-identity)
3. [Understanding Git Basics](#understanding-git-basics)
4. [Daily Workflow](#daily-workflow)
5. [Versioning Workflow](#versioning-workflow)
6. [Connecting to Remote Repository](#connecting-to-remote-repository)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

---

## Verify Your Current Setup

### Step 1: Check Git Installation
Open PowerShell or Command Prompt and run:

```bash
git --version
```

**Expected Output:** `git version 2.x.x` or similar

**If not installed:**
- Download from: https://git-scm.com/download/win
- Install with default settings
- Restart your terminal after installation

### Step 2: Check Repository Status
Navigate to your project folder and run:

```bash
cd C:\Users\TOWMJ2\webdev
git status
```

**Expected Output:** Should show "On branch main" and "nothing to commit, working tree clean"

### Step 3: Verify Initial Commit
Run:

```bash
git log --oneline
```

**Expected Output:** Should show at least 2 commits:
- One for "Initial commit: AcademiQR v0.4.1"
- One for "docs: add comprehensive versioning guide"

### Step 4: Check Version Tag
Run:

```bash
git tag -l
```

**Expected Output:** Should show `v0.4.1`

---

## Configure Git Identity

This ensures your commits are properly attributed to you.

### Step 1: Check Current Configuration
```bash
git config user.name
git config user.email
```

### Step 2: Set Global Configuration (Recommended)
Replace with YOUR actual name and email:

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"
```

**Example:**
```bash
git config --global user.name "John Doe"
git config --global user.email "john.doe@example.com"
```

### Step 3: Verify Configuration
```bash
git config --global --list | findstr user
```

**Expected Output:**
```
user.name=Your Full Name
user.email=your.email@example.com
```

### Step 4: Fix Previous Commits (If Needed)
If you already made commits with the wrong identity, you can update the last commit:

```bash
git commit --amend --reset-author --no-edit
```

---

## Understanding Git Basics

### What is Git?
Git is a version control system that tracks changes to your files over time. Think of it as a time machine for your code.

### Key Concepts:

1. **Repository (Repo):** Your project folder with Git tracking
2. **Commit:** A snapshot of your files at a specific point in time
3. **Branch:** A separate line of development (default: `main`)
4. **Tag:** A label for a specific version (e.g., `v0.4.1`)
5. **Remote:** A copy of your repository on GitHub/GitLab (optional)

### Basic Commands Explained:

| Command | What It Does |
|---------|-------------|
| `git status` | Shows what files have changed |
| `git add .` | Stages all changes for commit |
| `git commit -m "message"` | Creates a snapshot with a message |
| `git log` | Shows commit history |
| `git tag -l` | Lists all version tags |

---

## Daily Workflow

### Scenario 1: Making Changes and Committing

**Step 1: Make Your Changes**
- Edit files in your project
- Save your work

**Step 2: Check What Changed**
```bash
git status
```

**Example Output:**
```
On branch main
Changes not staged for commit:
  modified:   src/app.js
  modified:   index.html
```

**Step 3: See the Actual Changes**
```bash
git diff
```

This shows lines added (green +) and removed (red -).

**Step 4: Stage Your Changes**
```bash
# Option 1: Stage all changes
git add .

# Option 2: Stage specific files
git add src/app.js index.html
```

**Step 5: Verify Staged Changes**
```bash
git status
```

**Expected Output:**
```
On branch main
Changes to be committed:
  modified:   src/app.js
  modified:   index.html
```

**Step 6: Commit Your Changes**
```bash
git commit -m "feat: add user authentication to app"
```

**Good Commit Messages:**
- `feat: add user profile image upload`
- `fix: resolve OAuth redirect issue`
- `docs: update README with setup instructions`
- `style: format code with prettier`
- `refactor: reorganize component structure`

**Step 7: Verify Commit**
```bash
git log --oneline -1
```

---

## Versioning Workflow

### Understanding Semantic Versioning

Your version numbers follow: **MAJOR.MINOR.PATCH**

- **PATCH (0.4.1 → 0.4.2):** Bug fixes, small improvements
- **MINOR (0.4.1 → 0.5.0):** New features, backward compatible
- **MAJOR (0.4.1 → 1.0.0):** Breaking changes, not backward compatible

### Complete Version Bump Process

#### Example: Bumping Patch Version (0.4.1 → 0.4.2)

**Step 1: Ensure All Changes Are Committed**
```bash
git status
```

Make sure it says "nothing to commit, working tree clean". If not:
```bash
git add .
git commit -m "fix: resolve minor bug in authentication"
```

**Step 2: Run Version Bump Script**
```bash
npm run version:patch
```

**What Happens:**
- Updates `package.json` version
- Updates version in `index.html` and `public.html`
- Adds entry to `CHANGELOG.md`

**Example Output:**
```
Bumping version from 0.4.1 to 0.4.2...
✓ Updated package.json
✓ Updated index.html
✓ Updated public.html
✓ Updated CHANGELOG.md

✅ Version bumped to 0.4.2

Next steps:
  1. Review changes: git diff
  2. Commit changes: git add -A && git commit -m "chore: bump version to 0.4.2"
  3. Create tag: git tag -a v0.4.2 -m "Version 0.4.2"
  4. Push: git push && git push --tags
```

**Step 3: Review the Changes**
```bash
git diff
```

You should see changes in:
- `package.json` (version number)
- `index.html` (version in title/comments)
- `public.html` (version in title/comments)
- `CHANGELOG.md` (new entry)

**Step 4: Stage Version Changes**
```bash
git add -A
```

**Step 5: Commit Version Bump**
```bash
git commit -m "chore: bump version to 0.4.2"
```

**Step 6: Create Version Tag**
```bash
git tag -a v0.4.2 -m "Version 0.4.2 - Bug fixes and improvements"
```

**What is a tag?**
- A tag is a label pointing to a specific commit
- It marks a release version
- You can reference this exact version later

**Step 7: Verify Tag**
```bash
git tag -l
```

Should show: `v0.4.1` and `v0.4.2`

**Step 8: View Tag Details**
```bash
git show v0.4.2
```

### Bumping Minor Version (0.4.1 → 0.5.0)

Same process, but use:
```bash
npm run version:minor
```

### Bumping Major Version (0.4.1 → 1.0.0)

Same process, but use:
```bash
npm run version:major
```

---

## Connecting to Remote Repository

### Setting Up GitHub (Step-by-Step)

**Step 1: Create GitHub Account**
- Go to https://github.com
- Sign up for a free account
- Verify your email

**Step 2: Create New Repository**
1. Click the "+" icon → "New repository"
2. Repository name: `academiqr` (or your preferred name)
3. Description: "Link-in-bio builder with modern dark theme"
4. Visibility: Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

**Step 3: Copy Repository URL**
GitHub will show you commands. Copy the HTTPS URL, for example:
```
https://github.com/yourusername/academiqr.git
```

**Step 4: Add Remote to Your Local Repository**
```bash
git remote add origin https://github.com/yourusername/academiqr.git
```

Replace `yourusername` and `academiqr` with your actual values.

**Step 5: Verify Remote**
```bash
git remote -v
```

**Expected Output:**
```
origin  https://github.com/yourusername/academiqr.git (fetch)
origin  https://github.com/yourusername/academiqr.git (push)
```

**Step 6: Push Your Code**
```bash
# Push main branch
git push -u origin main

# Push all tags
git push --tags
```

**Step 7: Verify on GitHub**
- Refresh your GitHub repository page
- You should see all your files and commits

**Step 8: Future Pushes**
After the initial push, you can simply use:
```bash
git push
git push --tags  # When you create new version tags
```

---

## When to Create a Branch

Branches let you work on features, fixes, or experiments without affecting your main code. Here's when to use them:

### ✅ **CREATE A BRANCH When:**

#### 1. **Working on a New Feature**
**Example:** Adding user profile image upload, implementing dark mode, adding analytics

**Why:** Features can take multiple commits and might not work initially. Keep main branch stable.

```bash
git checkout -b feature/user-image-upload
# Make changes, commit multiple times
git checkout main  # Switch back when done
git merge feature/user-image-upload
```

#### 2. **Fixing a Bug**
**Example:** OAuth callback not working, database query failing

**Why:** Bug fixes can break other things. Isolate the fix.

```bash
git checkout -b fix/oauth-callback
# Fix the bug, test it
git checkout main
git merge fix/oauth-callback
```

#### 3. **Experimenting or Trying Something New**
**Example:** Testing a new library, trying a different UI approach

**Why:** You might want to throw it away if it doesn't work.

```bash
git checkout -b experiment/new-ui-library
# Try it out
# If it works: merge it
# If it doesn't: just delete the branch
```

#### 4. **Working on Something That Takes Multiple Days**
**Example:** Refactoring the entire authentication system

**Why:** You might need to pause and work on something urgent on main.

```bash
git checkout -b refactor/auth-system
# Work for days, commit as you go
# Switch to main if urgent bug comes up
```

#### 5. **Collaborating with Others**
**Example:** Multiple people working on different features

**Why:** Everyone works in their own branch, then merges when ready.

### ❌ **DON'T CREATE A BRANCH When:**

#### 1. **Simple, Single-Edit Fixes**
**Example:** Fixing a typo, updating documentation, small CSS tweak

**Why:** Overhead isn't worth it. Just commit directly to main.

```bash
# Just do this:
git add .
git commit -m "fix: correct typo in README"
git push
```

#### 2. **You're the Only Developer**
**Example:** Personal project, solo work, quick iterations

**Why:** If you're comfortable, work directly on main for speed.

**Exception:** Still create branches for major features or experiments.

#### 3. **Emergency Hotfix to Production**
**Example:** Critical security fix that needs immediate deployment

**Why:** Sometimes speed matters more. (But branches are still safer!)

### Branch Naming Conventions

Use clear, descriptive names:

**Good Names:**
- `feature/user-authentication`
- `fix/login-redirect-bug`
- `refactor/database-queries`
- `experiment/new-framework`
- `docs/update-readme`

**Bad Names:**
- `test` (too vague)
- `stuff` (not descriptive)
- `fix` (doesn't say what)
- `feature1` (not clear)

### Decision Flowchart

```
Start work on something
    ↓
Will this take more than 1 commit? ──NO──→ Commit directly to main
    ↓ YES
Will this take more than 1 hour? ──NO──→ Probably fine on main
    ↓ YES
Might this break things temporarily? ──NO──→ Could work on main
    ↓ YES
Do you need to switch tasks while working? ──NO──→ Could work on main
    ↓ YES
CREATE A BRANCH ✅
```

### Real-World Examples for Your Project

#### Example 1: Adding Analytics Dashboard
**Should you branch?** ✅ YES
- Multiple files affected
- Takes several commits
- Might break existing features

```bash
git checkout -b feature/analytics-dashboard
# Work on it
git add src/components/analytics/*
git commit -m "feat: add analytics dashboard component"
# ... more commits ...
git checkout main
git merge feature/analytics-dashboard
```

#### Example 2: Fixing CSS Typo
**Should you branch?** ❌ NO
- Single line change
- Quick fix
- Low risk

```bash
# Just commit directly
git add src/styles/main.css
git commit -m "fix: correct padding typo"
```

#### Example 3: Testing New Supabase Feature
**Should you branch?** ✅ YES
- Experimental
- Might not work
- Easy to abandon

```bash
git checkout -b experiment/supabase-realtime
# Try it out
# If it works: merge
# If not: git checkout main && git branch -D experiment/supabase-realtime
```

#### Example 4: Major Refactoring
**Should you branch?** ✅ YES
- Affects many files
- Takes multiple days
- High risk of breaking things

```bash
git checkout -b refactor/component-structure
# Work for days
# Multiple commits
git checkout main
git merge refactor/component-structure
```

### Branch Workflow Summary

```
main (stable, production-ready)
  ├── feature/user-profiles (new feature)
  ├── fix/database-error (bug fix)
  └── experiment/new-ui (experiment)
```

**Lifecycle:**
1. Create branch from main
2. Work and commit on branch
3. Switch back to main when needed
4. Merge branch when complete
5. Delete branch after merging

### Quick Branch Commands Reference

```bash
# Create and switch to new branch
git checkout -b feature/my-feature

# List all branches
git branch

# Switch between branches
git checkout main
git checkout feature/my-feature

# See which branch you're on
git branch  # * shows current branch

# Merge branch into main
git checkout main
git merge feature/my-feature

# Delete branch (after merging)
git branch -d feature/my-feature

# Force delete (even if not merged)
git branch -D feature/my-feature
```

### When in Doubt...

**General Rule:** If you're asking "should I create a branch?", the answer is probably **YES**.

- ✅ Creating branches is free (no cost)
- ✅ It's easy to delete if you don't need it
- ✅ It keeps your main branch clean
- ✅ It's better to have it and not need it than need it and not have it

**Exception:** For tiny, single-commit changes, working directly on main is fine.

---

## Common Tasks

### Task 1: Undo Last Commit (Keep Changes)

**Scenario:** You committed but want to change the commit message or add more files.

```bash
git reset --soft HEAD~1
```

This removes the commit but keeps your changes staged. Then:
```bash
# Make additional changes if needed
git add .
git commit -m "new commit message"
```

### Task 2: Undo Changes to a File

**Scenario:** You modified a file but want to revert to the last committed version.

```bash
# See what will be undone
git diff filename.js

# Undo the changes
git checkout -- filename.js
```

### Task 3: View Commit History

```bash
# Simple one-line view
git log --oneline

# Detailed view with file changes
git log --stat

# Pretty formatted view
git log --oneline --graph --decorate --all
```

### Task 4: Compare Versions

```bash
# Compare current code to a tag
git diff v0.4.1

# Compare two tags
git diff v0.4.1 v0.4.2

# See what changed in a commit
git show <commit-hash>
```

### Task 5: Create a New Branch

**Why?** To work on a feature without affecting main branch.

```bash
# Create and switch to new branch
git checkout -b feature/new-authentication

# Make changes, commit
git add .
git commit -m "feat: implement new authentication"

# Switch back to main
git checkout main

# Merge feature branch
git merge feature/new-authentication

# Delete feature branch (after merging)
git branch -d feature/new-authentication
```

### Task 6: Update Changelog Manually

If you want to add more details to CHANGELOG.md:

1. Open `CHANGELOG.md`
2. Find the latest version section
3. Add detailed entries under categories:
   - ### Added
   - ### Changed
   - ### Fixed
   - ### Removed
4. Save and commit:
```bash
git add CHANGELOG.md
git commit -m "docs: update changelog with detailed changes"
```

---

## Troubleshooting

### Problem: "fatal: not a git repository"

**Solution:** You're not in the project directory.
```bash
cd C:\Users\TOWMJ2\webdev
git status
```

### Problem: "Changes not staged for commit"

**Explanation:** You modified files but haven't staged them.

**Solution:**
```bash
git add .
git commit -m "your commit message"
```

### Problem: "Please tell me who you are"

**Solution:** Configure your Git identity (see [Configure Git Identity](#configure-git-identity) section).

### Problem: Authentication Failed When Pushing

**Solution:** Use Personal Access Token instead of password:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Give it "repo" permissions
4. Use token as password when pushing

### Problem: "Version bump script fails"

**Check:**
1. Are you in the project root directory?
2. Is Node.js installed? (`node --version`)
3. Are dependencies installed? (`npm install`)

### Problem: Want to see what changed in a specific commit

```bash
# Get commit hash from git log
git log --oneline

# View that commit
git show <commit-hash>
```

### Problem: Accidentally committed sensitive file

**If not pushed yet:**
```bash
# Remove from Git tracking but keep file locally
git rm --cached sensitive-file.txt
echo "sensitive-file.txt" >> .gitignore
git add .gitignore
git commit -m "chore: remove sensitive file from tracking"
```

**If already pushed:** You need to rewrite history (advanced - seek help or research `git filter-branch`).

---

## Quick Reference Cheat Sheet

### Daily Commands
```bash
git status                    # Check status
git add .                     # Stage all changes
git commit -m "message"       # Commit changes
git log --oneline            # View history
```

### Versioning Commands
```bash
npm run version:patch        # Bump patch version
npm run version:minor        # Bump minor version
npm run version:major        # Bump major version
git tag -a vX.Y.Z -m "msg"   # Create version tag
git tag -l                   # List all tags
```

### Remote Repository Commands
```bash
git remote add origin URL    # Add remote
git remote -v                # View remotes
git push -u origin main      # First push
git push                     # Subsequent pushes
git push --tags              # Push all tags
```

### Useful Commands
```bash
git diff                     # See unstaged changes
git diff --staged            # See staged changes
git checkout -- file         # Undo file changes
git log --graph --oneline    # Visual history
```

---

## Next Steps

1. ✅ **Completed:** Git repository initialized
2. ✅ **Completed:** Initial commit and tag created
3. ⬜ **Next:** Configure your Git identity
4. ⬜ **Next:** Connect to GitHub (optional)
5. ⬜ **Next:** Make your first feature commit
6. ⬜ **Next:** Bump version when ready for release

---

## Need More Help?

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com
- Semantic Versioning: https://semver.org

For project-specific questions, check:
- `VERSIONING.md` - Versioning guide
- `CHANGELOG.md` - Version history
- `README.md` - Project overview

