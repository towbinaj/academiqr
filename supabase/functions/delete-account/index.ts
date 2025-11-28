// Edge Function: Delete User Account
// This function handles complete account deletion including all associated data
// Addresses GDPR "right to be forgotten" requirement

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface DeleteAccountRequest {
  confirmText?: string; // Optional: user must type "DELETE" to confirm
}

serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    // Only allow POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client with service role (for admin operations)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Also create client with user's token to verify identity
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = user.id;
    console.log(`Account deletion requested for user: ${userId}`);

    // Parse request body (optional confirmation text)
    let requestData: DeleteAccountRequest = {};
    try {
      const body = await req.text();
      if (body) {
        requestData = JSON.parse(body);
      }
    } catch (e) {
      // Body is optional
    }

    // Optional: Require confirmation text
    if (requestData.confirmText && requestData.confirmText !== 'DELETE') {
      return new Response(JSON.stringify({ 
        error: 'Invalid confirmation. Please type "DELETE" to confirm.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Step 1: Get all user's collections (for cascading deletes)
    const { data: collections, error: collectionsError } = await supabaseAdmin
      .from('link_lists')
      .select('id')
      .eq('owner_id', userId);

    if (collectionsError) {
      console.error('Error fetching collections:', collectionsError);
      // Continue anyway - might not have collections
    }

    const collectionIds = collections?.map(c => c.id) || [];

    // Step 2: Delete all links in user's collections
    if (collectionIds.length > 0) {
      const { error: linksError } = await supabaseAdmin
        .from('link_items')
        .delete()
        .in('list_id', collectionIds);

      if (linksError) {
        console.error('Error deleting links:', linksError);
        // Continue - some links might already be deleted
      }
      console.log(`Deleted links from ${collectionIds.length} collections`);
    }

    // Step 3: Delete all collections
    const { error: collectionsDeleteError } = await supabaseAdmin
      .from('link_lists')
      .delete()
      .eq('owner_id', userId);

    if (collectionsDeleteError) {
      console.error('Error deleting collections:', collectionsDeleteError);
      return new Response(JSON.stringify({ 
        error: 'Failed to delete collections',
        details: collectionsDeleteError.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log('Deleted collections');

    // Step 4: Delete analytics data
    // First, get all link IDs from user's collections
    let allLinkIds: string[] = [];
    if (collectionIds.length > 0) {
      const { data: linksData } = await supabaseAdmin
        .from('link_items')
        .select('id')
        .in('list_id', collectionIds);
      
      allLinkIds = linksData?.map(l => l.id) || [];
    }

    // Delete link clicks
    if (allLinkIds.length > 0) {
      const { error: clicksError } = await supabaseAdmin
        .from('link_clicks')
        .delete()
        .in('link_id', allLinkIds);

      if (clicksError) {
        console.warn('Error deleting link clicks (may not exist):', clicksError);
      } else {
        console.log(`Deleted link clicks for ${allLinkIds.length} links`);
      }
    }

    // Delete analytics events (by list_id if column exists)
    if (collectionIds.length > 0) {
      const { error: analyticsError } = await supabaseAdmin
        .from('analytics_events')
        .delete()
        .in('list_id', collectionIds);

      if (analyticsError && !analyticsError.message.includes('column')) {
        console.warn('Error deleting analytics events by list_id:', analyticsError);
      } else if (!analyticsError) {
        console.log('Deleted analytics events by list_id');
      }
    }
    
    // Also delete by user_id if that column exists
    const { error: analyticsByUserError } = await supabaseAdmin
      .from('analytics_events')
      .delete()
      .eq('user_id', userId);

    if (analyticsByUserError && !analyticsByUserError.message.includes('column')) {
      console.warn('Error deleting analytics by user_id:', analyticsByUserError);
    } else if (!analyticsByUserError) {
      console.log('Deleted analytics events by user_id');
    }
    
    console.log('Deleted analytics data');

    // Step 5: Delete media files from storage
    // Delete profile photo if it exists
    try {
      // Get profile to find photo path (before we delete the profile)
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('profile_photo')
        .eq('id', userId)
        .single();

      if (profile?.profile_photo) {
        // Extract file path from URL if it's a storage URL
        const photoUrl = profile.profile_photo;
        if (photoUrl.includes('/storage/v1/object/')) {
          // Parse storage path
          const pathMatch = photoUrl.match(/\/storage\/v1\/object\/([^/]+)\/(.+)/);
          if (pathMatch) {
            const bucket = pathMatch[1];
            const path = decodeURIComponent(pathMatch[2]);
            
            const { error: storageError } = await supabaseAdmin.storage
              .from(bucket)
              .remove([path]);

            if (storageError) {
              console.warn('Error deleting profile photo from storage:', storageError);
            } else {
              console.log('Deleted profile photo from storage');
            }
          }
        }
      }
      
      // Delete user's media files from storage (if stored in user-specific folders)
      // Note: This assumes media files are stored in a folder structure like: userId/filename
      try {
        // List all buckets and try to delete user's files
        const { data: buckets } = await supabaseAdmin.storage.listBuckets();
        
        for (const bucket of buckets || []) {
          if (bucket.name === 'profile-photos' || bucket.name === 'link-images' || bucket.name.includes('media')) {
            // Try to list and delete files in user's folder
            const { data: files } = await supabaseAdmin.storage
              .from(bucket.name)
              .list(userId);
            
            if (files && files.length > 0) {
              const filePaths = files.map(f => `${userId}/${f.name}`);
              const { error: deleteError } = await supabaseAdmin.storage
                .from(bucket.name)
                .remove(filePaths);
              
              if (deleteError) {
                console.warn(`Error deleting files from ${bucket.name}:`, deleteError);
              } else {
                console.log(`Deleted ${files.length} files from ${bucket.name}`);
              }
            }
          }
        }
      } catch (mediaErr) {
        console.warn('Error deleting media files:', mediaErr);
        // Continue - media deletion is not critical for account deletion
      }
    } catch (storageErr) {
      console.warn('Error handling storage deletion:', storageErr);
      // Continue - storage deletion is not critical
    }

    // Step 6: Delete profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      return new Response(JSON.stringify({ 
        error: 'Failed to delete profile',
        details: profileError.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log('Deleted profile');

    // Step 7: Delete user from auth (requires admin client)
    const { error: userDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (userDeleteError) {
      console.error('Error deleting user from auth:', userDeleteError);
      return new Response(JSON.stringify({ 
        error: 'Failed to delete user account',
        details: userDeleteError.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log('Deleted user from auth');

    // Success - all data deleted
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Account and all associated data deleted successfully'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

