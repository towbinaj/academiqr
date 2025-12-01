/**
 * Recovery Script: Recover missing media library items
 * 
 * This script helps recover media items that might be:
 * 1. Still in localStorage
 * 2. Referenced in link_items but not in user_media
 * 3. Lost during migration
 * 
 * Run this in the browser console while logged into your site
 */

async function recoverMediaLibrary() {
    console.log('🔍 Starting media library recovery...\n');
    
    // Check localStorage
    console.log('1. Checking localStorage...');
    const stored = localStorage.getItem('academiq-media');
    if (stored) {
        try {
            const parsedFiles = JSON.parse(stored);
            console.log(`   ✅ Found ${parsedFiles.length} items in localStorage`);
            parsedFiles.forEach((file, index) => {
                console.log(`   ${index + 1}. ${file.name} (${file.size ? (file.size / 1024).toFixed(2) + 'KB' : 'unknown size'})`);
            });
        } catch (e) {
            console.log('   ❌ Error parsing localStorage data:', e);
        }
    } else {
        console.log('   ⚠️ No items found in localStorage');
    }
    
    // Check backup
    console.log('\n2. Checking localStorage backup...');
    const backup = localStorage.getItem('academiq-media-backup');
    if (backup) {
        try {
            const backupData = JSON.parse(backup);
            console.log(`   ✅ Found backup with ${backupData.count || 0} items`);
            if (backupData.mediaFiles) {
                backupData.mediaFiles.forEach((file, index) => {
                    console.log(`   ${index + 1}. ${file.name} (${file.size ? (file.size / 1024).toFixed(2) + 'KB' : 'unknown size'})`);
                });
            }
        } catch (e) {
            console.log('   ❌ Error parsing backup data:', e);
        }
    } else {
        console.log('   ⚠️ No backup found');
    }
    
    // Check database (ONLY for current user)
    console.log('\n3. Checking database (current user only)...');
    if (typeof supabaseClient === 'undefined' || !supabaseClient) {
        console.log('   ❌ Supabase client not available');
        return;
    }
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        console.log('   ❌ User not logged in');
        return;
    }
    
    console.log(`   👤 Checking media for user: ${user.id}`);
    
    const { data: dbMedia, error: dbError } = await supabaseClient
        .from('user_media')
        .select('*')
        .eq('user_id', user.id); // ✅ Properly scoped to current user only
    
    if (dbError) {
        console.log('   ❌ Error querying database:', dbError);
    } else {
        console.log(`   ✅ Found ${dbMedia?.length || 0} items in database`);
        if (dbMedia && dbMedia.length > 0) {
            dbMedia.forEach((file, index) => {
                console.log(`   ${index + 1}. ${file.name} (${file.size ? (file.size / 1024).toFixed(2) + 'KB' : 'unknown size'})`);
            });
        }
    }
    
    // Check link_items for images (ONLY for current user's collections)
    console.log('\n4. Checking link_items for images (current user\'s collections only)...');
    
    // First get user's collections
    const { data: userCollections, error: collectionsError } = await supabaseClient
        .from('link_lists')
        .select('id')
        .eq('owner_id', user.id); // ✅ Only current user's collections
    
    if (collectionsError) {
        console.log('   ❌ Error querying collections:', collectionsError);
    } else {
        const collectionIds = userCollections?.map(c => c.id) || [];
        console.log(`   📁 Found ${collectionIds.length} collections owned by current user`);
        
        if (collectionIds.length > 0) {
            const { data: links, error: linksError } = await supabaseClient
                .from('link_items')
                .select('id, title, image, image_url, list_id')
                .in('list_id', collectionIds) // ✅ Only links from user's collections
                .or('image.not.is.null,image_url.not.is.null');
            
            if (linksError) {
                console.log('   ❌ Error querying link_items:', linksError);
            } else {
                console.log(`   ✅ Found ${links?.length || 0} links with images (user's collections only)`);
                
                // Get unique image URLs
                const imageUrls = new Set();
                links?.forEach(link => {
                    if (link.image && link.image.startsWith('https://')) {
                        imageUrls.add(link.image);
                    }
                    if (link.image_url && link.image_url.startsWith('https://')) {
                        imageUrls.add(link.image_url);
                    }
                });
                
                console.log(`   📸 Found ${imageUrls.size} unique image URLs in user's links`);
                
                // Check which ones are in Supabase Storage (from our migration)
                const storageUrls = Array.from(imageUrls).filter(url => 
                    url.includes('supabase.co/storage/v1/object/')
                );
                console.log(`   📦 ${storageUrls.length} are in Supabase Storage`);
            }
        }
    }
    
    if (linksError) {
        console.log('   ❌ Error querying link_items:', linksError);
    } else {
        console.log(`   ✅ Found ${links?.length || 0} links with images`);
        
        // Get unique image URLs
        const imageUrls = new Set();
        links?.forEach(link => {
            if (link.image && link.image.startsWith('https://')) {
                imageUrls.add(link.image);
            }
            if (link.image_url && link.image_url.startsWith('https://')) {
                imageUrls.add(link.image_url);
            }
        });
        
        console.log(`   📸 Found ${imageUrls.size} unique image URLs in links`);
        
        // Check which ones are in Supabase Storage (from our migration)
        const storageUrls = Array.from(imageUrls).filter(url => 
            url.includes('supabase.co/storage/v1/object/')
        );
        console.log(`   📦 ${storageUrls.length} are in Supabase Storage`);
    }
    
    console.log('\n✅ Recovery check complete!');
    console.log('\nTo manually trigger migration from localStorage to database:');
    console.log('1. Open the media library');
    console.log('2. The migrateLocalStorageToDatabase() function should run automatically');
    console.log('3. Or call: migrateLocalStorageToDatabase() in the console');
}

// Make it available globally
window.recoverMediaLibrary = recoverMediaLibrary;

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('Media library recovery script loaded.');
    console.log('Run: recoverMediaLibrary() to check for missing items');
}

