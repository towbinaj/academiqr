// Script to calculate CSP hashes for inline scripts
import fs from 'fs';
import crypto from 'crypto';

// Read the HTML file
const html = fs.readFileSync('index.html', 'utf8');

// Find all inline script blocks (not external scripts)
const scriptRegex = /<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/gi;
const matches = [...html.matchAll(scriptRegex)];

console.log(`Found ${matches.length} inline script blocks\n`);

const hashes = [];

matches.forEach((match, index) => {
    const scriptContent = match[2].trim();
    if (scriptContent) {
        // Calculate SHA256 hash
        const hash = crypto.createHash('sha256').update(scriptContent, 'utf8').digest('base64');
        hashes.push(`'sha256-${hash}'`);
        console.log(`Script ${index + 1}:`);
        console.log(`  Length: ${scriptContent.length} characters`);
        console.log(`  Hash: sha256-${hash}`);
        console.log(`  Preview: ${scriptContent.substring(0, 100)}...\n`);
    }
});

console.log('\n=== CSP script-src directive ===\n');
console.log(`script-src 'self' ${hashes.join(' ')} https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;`);

