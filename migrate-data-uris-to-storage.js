/**
 * Migration Script: Convert base64 data URIs to Supabase Storage files
 * 
 * This script:
 * 1. Finds all link_items with base64 data URI images
 * 2. Converts them to files in Supabase Storage
 * 3. Updates the database with the new storage URLs
 * 
 * Usage:
 * 1. Set your Supabase credentials below
 * 2. Run: node migrate-data-uris-to-storage.js
 * 
 * IMPORTANT: Backup your database before running this!
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// CONFIGURATION - Update these with your Supabase credentials
// ============================================================================
const SUPABASE_URL = 'https://natzpfyxpuycsuuzbqrd.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHpwZnl4cHV5Y3N1dXpicXJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk1MTE4NCwiZXhwIjoyMDc2NTI3MTg0fQ.SJyaMD0CK6j0wvbS7nQJwkuK9dGlLByNsRtpeQDB9A4'; // ⚠️ Get this from Supabase Dashboard → Settings → API → service_role key
const STORAGE_BUCKET = 'link-images'; // Bucket name for storing images

// ============================================================================
// Initialize Supabase client
// ============================================================================
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Convert data URI to buffer
 */
function dataUriToBuffer(dataUri) {
    const base64Data = dataUri.split(',')[1];
    return Buffer.from(base64Data, 'base64');
}

/**
 * Get file extension from MIME type
 */
function getExtensionFromMimeType(mimeType) {
    // Normalize MIME type (remove +xml, etc.)
    const normalized = mimeType.toLowerCase().split('+')[0].split(';')[0];
    
    const mimeMap = {
        'jpeg': 'jpg',
        'jpg': 'jpg',
        'png': 'png',
        'gif': 'gif',
        'webp': 'webp',
        'svg': 'svg',
        'svg+xml': 'svg',
        'bmp': 'bmp',
        'ico': 'ico'
    };
    return mimeMap[normalized] || 'png';
}

/**
 * Upload data URI to Supabase Storage
 */
async function uploadDataUriToStorage(dataUri, linkId, fieldName) {
    try {
        // Parse data URI (handle both with and without semicolon)
        // Format: data:image/[mime];base64,[data] or data:image/[mime],[data]
        const matches = dataUri.match(/^data:image\/([^;,]+)(?:;base64)?,(.+)$/);
        if (!matches) {
            throw new Error(`Invalid data URI format for link ${linkId}`);
        }
        
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const extension = getExtensionFromMimeType(mimeType);
        const fileName = `${linkId}-${fieldName}-${Date.now()}.${extension}`;
        const filePath = `links/${fileName}`;
        
        // Upload to storage
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, buffer, {
                contentType: `image/${mimeType}`,
                upsert: false
            });
        
        if (error) {
            throw error;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);
        
        return urlData.publicUrl;
    } catch (error) {
        console.error(`Error uploading ${fieldName} for link ${linkId}:`, error);
        throw error;
    }
}

/**
 * Migrate a single link item
 */
async function migrateLinkItem(link) {
    const updates = {};
    let hasChanges = false;
    
    try {
        // Migrate image field
        if (link.image && link.image.startsWith('data:image')) {
            console.log(`Migrating image for link ${link.id}...`);
            const newUrl = await uploadDataUriToStorage(link.image, link.id, 'image');
            updates.image = newUrl;
            hasChanges = true;
        }
        
        // Migrate image_url field
        if (link.image_url && link.image_url.startsWith('data:image')) {
            console.log(`Migrating image_url for link ${link.id}...`);
            const newUrl = await uploadDataUriToStorage(link.image_url, link.id, 'image_url');
            updates.image_url = newUrl;
            hasChanges = true;
        }
        
        // Update database if there are changes
        if (hasChanges) {
            const { error } = await supabase
                .from('link_items')
                .update(updates)
                .eq('id', link.id);
            
            if (error) {
                throw error;
            }
            
            console.log(`✅ Migrated link ${link.id}`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`❌ Failed to migrate link ${link.id}:`, error);
        return false;
    }
}

/**
 * Main migration function
 */
async function migrate() {
    console.log('Starting migration of data URIs to Supabase Storage...\n');
    
    // Check if bucket exists, create if not
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        return;
    }
    
    const bucketExists = buckets.some(b => b.name === STORAGE_BUCKET);
    if (!bucketExists) {
        console.log(`Creating bucket ${STORAGE_BUCKET}...`);
        const { error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
            public: true
        });
        if (createError) {
            console.error('Error creating bucket:', createError);
            return;
        }
    }
    
    // Fetch all links with data URIs
    // Note: Supabase doesn't support regex in queries, so we fetch all and filter
    const { data: allLinks, error: fetchError } = await supabase
        .from('link_items')
        .select('id, image, image_url');
    
    if (fetchError) {
        console.error('Error fetching links:', fetchError);
        return;
    }
    
    // Filter to only links with data URIs
    const links = allLinks.filter(link => 
        (link.image && link.image.startsWith('data:image')) ||
        (link.image_url && link.image_url.startsWith('data:image'))
    );
    
    console.log(`Found ${links.length} links with data URIs to migrate\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    // Migrate each link
    for (const link of links) {
        const success = await migrateLinkItem(link);
        if (success) {
            successCount++;
        } else {
            failCount++;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n✅ Migration complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${failCount}`);
}

// Run migration
migrate().catch(console.error);

export { migrate, migrateLinkItem };

