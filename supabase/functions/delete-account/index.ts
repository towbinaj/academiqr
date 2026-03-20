// Supabase Edge Function: delete-account
// Fully deletes the authenticated user's account (GDPR compliant)
// - Deletes all user data from database tables
// - Deletes uploaded files from Storage
// - Deletes the Auth user record
//
// Deploy: supabase functions deploy delete-account
// The function uses the service role key (available as env var in Edge Functions)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Create client with service role (admin access)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Verify the caller is authenticated
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Get the user from the JWT token
    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const userId = user.id
    const deletionLog: string[] = []

    // 1. Delete analytics data
    await supabaseAdmin.from("link_clicks").delete().eq("owner_id", userId)
    deletionLog.push("link_clicks")

    await supabaseAdmin.from("page_views").delete().eq("owner_id", userId)
    deletionLog.push("page_views")

    // 2. Get all user's collection IDs
    const { data: userLists } = await supabaseAdmin
      .from("link_lists")
      .select("id")
      .eq("owner_id", userId)

    // 3. Delete all link_items
    if (userLists && userLists.length > 0) {
      const listIds = userLists.map((l: { id: string }) => l.id)
      await supabaseAdmin.from("link_items").delete().in("list_id", listIds)
      deletionLog.push(`link_items (${listIds.length} collections)`)
    }

    // 4. Delete collections
    await supabaseAdmin.from("link_lists").delete().eq("owner_id", userId)
    deletionLog.push("link_lists")

    // 5. Delete themes
    await supabaseAdmin.from("user_themes").delete().eq("user_id", userId)
    deletionLog.push("user_themes")

    // 6. Delete profile
    await supabaseAdmin.from("profiles").delete().eq("id", userId)
    deletionLog.push("profiles")

    // 7. Clean up Storage
    const bucket = "link-images"
    const categories = ["links", "profiles", "backgrounds"]
    let filesDeleted = 0

    for (const category of categories) {
      try {
        const { data: files } = await supabaseAdmin.storage
          .from(bucket)
          .list(`${userId}/${category}`)

        if (files && files.length > 0) {
          const paths = files
            .filter((f: { name: string }) => f.name && f.name !== ".emptyFolderPlaceholder")
            .map((f: { name: string }) => `${userId}/${category}/${f.name}`)

          if (paths.length > 0) {
            await supabaseAdmin.storage.from(bucket).remove(paths)
            filesDeleted += paths.length
          }
        }
      } catch {
        // Non-critical — continue
      }
    }
    deletionLog.push(`storage (${filesDeleted} files)`)

    // 8. Delete the Auth user (this is the GDPR-critical step)
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (deleteUserError) {
      console.error("Failed to delete auth user:", deleteUserError)
      return new Response(JSON.stringify({
        error: "Data deleted but failed to remove auth account. Contact support.",
        deletionLog,
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
    deletionLog.push("auth_user")

    console.log(`[delete-account] User ${userId} fully deleted:`, deletionLog)

    return new Response(JSON.stringify({
      success: true,
      message: "Account and all associated data have been permanently deleted.",
      deletionLog,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })

  } catch (err) {
    console.error("[delete-account] Unexpected error:", err)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
