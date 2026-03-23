<?php
/**
 * AcademiQR — Dynamic XML sitemap for public collections
 *
 * Queries Supabase for all public collections (no passkey) and generates
 * a standard XML sitemap with URLs in the format /u/{username}/{slug}.
 */

header('Content-Type: application/xml; charset=UTF-8');

$SUPABASE_URL = 'https://natzpfyxpuycsuuzbqrd.supabase.co';
$SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHpwZnl4cHV5Y3N1dXpicXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2ODEwMDgsImV4cCI6MjAzOTI1NzAwOH0.oBMY_bAPdBSXrF-kOgKnqFT1sdVd9hUH7ECg0fL5P14';

// Fetch all public collections (passkey is null) with their owner's username
$apiUrl = "$SUPABASE_URL/rest/v1/link_lists?select=slug,updated_at,owner_id,profiles!inner(username)&passkey=is.null&order=updated_at.desc";

$json = file_get_contents($apiUrl, false,
    stream_context_create(['http' => ['header' => "apikey: $SUPABASE_ANON_KEY\r\nAuthorization: Bearer $SUPABASE_ANON_KEY"]]));

$collections = json_decode($json, true) ?? [];

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<?php foreach ($collections as $coll):
    $username = $coll['profiles']['username'] ?? null;
    $slug = $coll['slug'] ?? null;
    if (!$username || !$slug) continue;

    $loc = htmlspecialchars("https://academiqr.com/u/$username/$slug", ENT_XML1, 'UTF-8');
    $lastmod = '';
    if (!empty($coll['updated_at'])) {
        $lastmod = date('Y-m-d', strtotime($coll['updated_at']));
    }
?>
  <url>
    <loc><?= $loc ?></loc>
<?php if ($lastmod): ?>
    <lastmod><?= $lastmod ?></lastmod>
<?php endif; ?>
    <priority>0.7</priority>
  </url>
<?php endforeach; ?>
</urlset>
