// Script to generate SRI hashes for CDN resources
import https from 'https';
import crypto from 'crypto';

const resources = [
    {
        name: 'Supabase JS',
        url: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/index.umd.js',
        type: 'script'
    },
    {
        name: 'QRCode.js',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
        type: 'script'
    },
    {
        name: 'qrcode-generator',
        url: 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js',
        type: 'script'
    }
];

function fetchAndHash(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
                return;
            }
            
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                const content = Buffer.concat(chunks);
                const hash = crypto.createHash('sha384').update(content).digest('base64');
                resolve(hash);
            });
        }).on('error', reject);
    });
}

async function generateHashes() {
    console.log('Generating SRI hashes for CDN resources...\n');
    
    for (const resource of resources) {
        try {
            console.log(`Fetching ${resource.name}...`);
            const hash = await fetchAndHash(resource.url);
            console.log(`${resource.name}:`);
            console.log(`  URL: ${resource.url}`);
            console.log(`  SRI: sha384-${hash}\n`);
        } catch (error) {
            console.error(`Error fetching ${resource.name}:`, error.message);
        }
    }
}

generateHashes();

