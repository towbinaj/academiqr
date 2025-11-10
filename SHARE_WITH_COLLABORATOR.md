# How to Share Your Code with a Collaborator on GitHub

## Step 1: Push Your Code to GitHub (If Not Already Done)

### Option A: Create a New Repository on GitHub

1. **Go to GitHub.com** and sign in
2. **Click the "+" icon** (top right) → **"New repository"**
3. **Repository settings:**
   - Name: `academiqr` (or your preferred name)
   - Description: "Link-in-bio builder with analytics"
   - Visibility: **Private** (recommended) or **Public**
   - **DO NOT** initialize with README, .gitignore, or license (you already have these)
4. **Click "Create repository"**

### Option B: If Repository Already Exists

If you already created a repository, just note the URL.

### Step 2: Connect Your Local Repository to GitHub

**If you haven't connected yet:**

```bash
# Add GitHub as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push your code
git push -u origin main
```

**If remote already exists but you haven't pushed:**

```bash
# Push your code
git push -u origin main
```

## Step 3: Add Collaborator on GitHub

### Method 1: Through GitHub Website (Easiest)

1. **Go to your repository** on GitHub.com
2. **Click "Settings"** (top right of repository page)
3. **Click "Collaborators"** in the left sidebar
4. **Click "Add people"** button
5. **Enter collaborator's GitHub username or email**
6. **Click "Add [username] to this repository"**
7. **Choose permission level:**
   - **Read** - Can view and clone, but can't make changes
   - **Write** - Can push changes, create branches, etc.
   - **Admin** - Full access including settings
8. **Click "Add [username]"**
9. **Collaborator receives email invitation** to accept

### Method 2: Through Repository Settings

1. Repository → **Settings** → **Access** → **Collaborators and teams**
2. Click **"Add people"**
3. Follow same steps as above

## Step 4: Collaborator Accepts Invitation

**What the collaborator needs to do:**

1. **Check email** for invitation from GitHub
2. **Click "Accept invitation"** link
3. **Or go to:** https://github.com/notifications
4. **Accept the invitation**

## Step 5: Collaborator Clones the Repository

**After accepting invitation, collaborator runs:**

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git

# Navigate into project
cd REPO_NAME

# Install dependencies
npm install
```

## Permission Levels Explained

### Read
- ✅ View code
- ✅ Clone repository
- ✅ Create issues
- ❌ Cannot push changes
- ❌ Cannot create branches

### Write (Recommended for Collaborators)
- ✅ Everything in Read
- ✅ Push changes
- ✅ Create branches
- ✅ Create pull requests
- ✅ Merge pull requests
- ❌ Cannot change settings
- ❌ Cannot delete repository

### Admin
- ✅ Everything in Write
- ✅ Change repository settings
- ✅ Add/remove collaborators
- ✅ Delete repository

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Repository created (if new)
- [ ] Collaborator added in Settings → Collaborators
- [ ] Permission level set (usually "Write")
- [ ] Collaborator accepts invitation
- [ ] Collaborator clones repository

## Troubleshooting

### "Repository not found" error
- Make sure you've pushed your code: `git push -u origin main`
- Check the repository URL is correct
- Verify you're logged into GitHub

### Collaborator can't see repository
- Check they accepted the invitation
- Verify they're logged into the correct GitHub account
- Check invitation wasn't expired

### Collaborator can't push
- Verify they have "Write" or "Admin" permissions
- Check they've cloned the repository correctly
- Make sure they've configured their Git identity:
  ```bash
  git config user.name "Their Name"
  git config user.email "their.email@example.com"
  ```

## Alternative: Using GitHub Organizations

If you're working with a team, consider:
- Creating a GitHub Organization
- Adding repository to organization
- Adding collaborators to organization
- Better for managing multiple projects

## Security Notes

- **Private repositories** are recommended for personal/commercial projects
- **Public repositories** are visible to everyone
- Collaborators with "Write" access can push directly to main (consider branch protection)
- Consider using **Pull Requests** for code review before merging

