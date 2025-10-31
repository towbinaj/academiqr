#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read package.json
const packagePath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Parse current version
const [major, minor, patch] = packageJson.version.split('.').map(Number);

// Determine version bump type
const bumpType = process.argv[2] || 'patch';
let newVersion;

switch (bumpType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

console.log(`Bumping version from ${packageJson.version} to ${newVersion}...`);

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('✓ Updated package.json');

// Update index.html
const indexPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Update title
  indexContent = indexContent.replace(
    /<title>AcademiQR v[\d.]+/g,
    `<title>AcademiQR v${newVersion}`
  );
  
  // Update version in HTML comments or display
  indexContent = indexContent.replace(
    /AcademiQR v[\d.]+/g,
    `AcademiQR v${newVersion}`
  );
  
  fs.writeFileSync(indexPath, indexContent);
  console.log('✓ Updated index.html');
}

// Update public.html
const publicPath = path.join(rootDir, 'public.html');
if (fs.existsSync(publicPath)) {
  let publicContent = fs.readFileSync(publicPath, 'utf8');
  
  // Update title
  publicContent = publicContent.replace(
    /<title>[^<]*AcademiQR[^<]*v[\d.]+/g,
    `<title>AcademiQR v${newVersion}`
  );
  
  // Update version in HTML
  publicContent = publicContent.replace(
    /AcademiQR v[\d.]+/g,
    `AcademiQR v${newVersion}`
  );
  
  fs.writeFileSync(publicPath, publicContent);
  console.log('✓ Updated public.html');
}

// Update CHANGELOG.md if it exists
const changelogPath = path.join(rootDir, 'CHANGELOG.md');
if (fs.existsSync(changelogPath)) {
  const changelog = fs.readFileSync(changelogPath, 'utf8');
  const today = new Date().toISOString().split('T')[0];
  const newEntry = `## [${newVersion}] - ${today}\n\n### Changed\n- Version bump to ${newVersion}\n\n`;
  
  // Insert after the first line (usually # Changelog)
  const lines = changelog.split('\n');
  const insertIndex = lines.findIndex(line => line.startsWith('## [')) !== -1
    ? lines.findIndex(line => line.startsWith('## ['))
    : 1;
  
  lines.splice(insertIndex, 0, newEntry);
  fs.writeFileSync(changelogPath, lines.join('\n'));
  console.log('✓ Updated CHANGELOG.md');
}

console.log(`\n✅ Version bumped to ${newVersion}`);
console.log('\nNext steps:');
console.log(`  1. Review changes: git diff`);
console.log(`  2. Commit changes: git add -A && git commit -m "chore: bump version to ${newVersion}"`);
console.log(`  3. Create tag: git tag -a v${newVersion} -m "Version ${newVersion}"`);
console.log(`  4. Push: git push && git push --tags`);


