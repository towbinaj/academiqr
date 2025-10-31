# Versioning Guide

This project follows [Semantic Versioning](https://semver.org/) (SemVer) and uses an automated versioning workflow.

## Current Version

The current version is defined in `package.json` and is **0.4.1**.

## Version Number Format

Versions follow the format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes that are incompatible with previous versions
- **MINOR**: New features that are backward compatible
- **PATCH**: Bug fixes and minor updates that are backward compatible

## Versioning Workflow

### Bumping Versions

Use npm scripts to automatically bump versions:

```bash
# Patch version (0.4.1 -> 0.4.2) - for bug fixes
npm run version:patch

# Minor version (0.4.1 -> 0.5.0) - for new features
npm run version:minor

# Major version (0.4.1 -> 1.0.0) - for breaking changes
npm run version:major
```

These scripts will:
1. Update `package.json` version
2. Update version in `index.html` and `public.html`
3. Add a new entry to `CHANGELOG.md`
4. Show next steps for git commits and tags

### Git Workflow After Version Bump

After running a version bump script:

1. **Review changes:**
   ```bash
   git diff
   ```

2. **Stage and commit:**
   ```bash
   git add -A
   git commit -m "chore: bump version to X.Y.Z"
   ```

3. **Create a git tag:**
   ```bash
   git tag -a vX.Y.Z -m "Version X.Y.Z - Description of changes"
   ```

4. **Push to remote (if configured):**
   ```bash
   git push
   git push --tags
   ```

## Commit Message Convention

Follow conventional commits for better changelog generation:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test additions/changes
- `chore:` Maintenance tasks (version bumps, dependency updates)

Example:
```bash
git commit -m "feat: add user profile image upload"
git commit -m "fix: resolve OAuth callback redirect issue"
git commit -m "chore: bump version to 0.4.2"
```

## Tags

Git tags are created for each version release. Tags use the format `vX.Y.Z` (e.g., `v0.4.1`).

To list all tags:
```bash
git tag -l
```

To view tag details:
```bash
git show v0.4.1
```

## Changelog

All version changes are documented in `CHANGELOG.md` following the [Keep a Changelog](https://keepachangelog.com/) format.

The changelog is automatically updated when using version bump scripts.

## Branch Strategy (Recommended)

For future development, consider:

- `main` - Stable, production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `release/*` - Release preparation

## Release Checklist

When preparing a new release:

- [ ] Run version bump script
- [ ] Review and update CHANGELOG.md
- [ ] Test all changes
- [ ] Commit version changes
- [ ] Create git tag
- [ ] Push to remote repository
- [ ] Create release notes on GitHub/GitLab (if applicable)

