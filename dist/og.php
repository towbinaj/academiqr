<?php
/**
 * AcademiQR — Open Graph meta tag server for social media crawlers
 *
 * Apache rewrites social crawler requests to this file, which fetches
 * collection data from Supabase and returns HTML with proper OG tags.
 * Regular browsers get redirected to the SPA (public.html).
 *
 * Place in the web root alongside public.html.
 * Requires the .htaccess rewrite rules to route crawler traffic here.
 */

// Supabase config
$SUPABASE_URL = 'https://natzpfyxpuycsuuzbqrd.supabase.co';
$SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHpwZnl4cHV5Y3N1dXpicXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2ODEwMDgsImV4cCI6MjAzOTI1NzAwOH0.oBMY_bAPdBSXrF-kOgKnqFT1sdVd9hUH7ECg0fL5P14';

// Detect if this is a social media crawler
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
$crawlers = ['facebookexternalhit', 'Twitterbot', 'LinkedInBot', 'Slackbot', 'Discordbot', 'WhatsApp', 'TelegramBot'];
$isCrawler = false;
foreach ($crawlers as $bot) {
    if (stripos($ua, $bot) !== false) {
        $isCrawler = true;
        break;
    }
}

// If not a crawler, redirect to the SPA
if (!$isCrawler) {
    $path = $_SERVER['REQUEST_URI'];
    header("Location: /public.html" . (strpos($path, '?') !== false ? '?' . parse_url($path, PHP_URL_QUERY) : ''));
    exit;
}

// Parse URL: /u/username/slug or ?user=...&collection=...
$collectionId = null;
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (preg_match('#^/u/([^/]+)/([^/]+)/?$#', $path, $matches)) {
    $username = $matches[1];
    $slug = $matches[2];

    // Look up user by username
    $profileJson = file_get_contents("$SUPABASE_URL/rest/v1/profiles?username=eq.$username&select=id", false,
        stream_context_create(['http' => ['header' => "apikey: $SUPABASE_ANON_KEY\r\nAuthorization: Bearer $SUPABASE_ANON_KEY"]]));
    $profiles = json_decode($profileJson, true);

    if ($profiles && count($profiles) > 0) {
        $ownerId = $profiles[0]['id'];
        // Look up collection by slug + owner
        $collJson = file_get_contents("$SUPABASE_URL/rest/v1/link_lists?owner_id=eq.$ownerId&slug=eq.$slug&select=id", false,
            stream_context_create(['http' => ['header' => "apikey: $SUPABASE_ANON_KEY\r\nAuthorization: Bearer $SUPABASE_ANON_KEY"]]));
        $colls = json_decode($collJson, true);
        if ($colls && count($colls) > 0) {
            $collectionId = $colls[0]['id'];
        }
    }
} else {
    $collectionId = $_GET['collection'] ?? null;
}

// Default OG values
$ogTitle = 'AcademiQR Collection';
$ogDescription = 'Academic link collection powered by AcademiQR';
$ogImage = 'https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_Dark.png';

if ($collectionId) {
    // Fetch collection
    $collJson = file_get_contents("$SUPABASE_URL/rest/v1/link_lists?id=eq.$collectionId&select=presentation_data,owner_id", false,
        stream_context_create(['http' => ['header' => "apikey: $SUPABASE_ANON_KEY\r\nAuthorization: Bearer $SUPABASE_ANON_KEY"]]));
    $collections = json_decode($collJson, true);

    if ($collections && count($collections) > 0) {
        $coll = $collections[0];
        $pd = $coll['presentation_data'] ?? [];
        $ogTitle = $pd['title'] ?? 'AcademiQR Collection';

        $parts = [];

        // Fetch profile for display name + photo
        $ownerId = $coll['owner_id'];
        $profJson = file_get_contents("$SUPABASE_URL/rest/v1/profiles?id=eq.$ownerId&select=display_name,profile_photo", false,
            stream_context_create(['http' => ['header' => "apikey: $SUPABASE_ANON_KEY\r\nAuthorization: Bearer $SUPABASE_ANON_KEY"]]));
        $profs = json_decode($profJson, true);

        if ($profs && count($profs) > 0) {
            if (!empty($profs[0]['display_name'])) $parts[] = $profs[0]['display_name'];
            if (!empty($profs[0]['profile_photo']) && !str_starts_with($profs[0]['profile_photo'], 'data:')) {
                $ogImage = $profs[0]['profile_photo'];
            }
        }

        if (!empty($pd['conference'])) $parts[] = $pd['conference'];
        $ogDescription = count($parts) > 0 ? $ogTitle . ' — ' . implode(' • ', $parts) : $ogTitle;
    }
}

$ogTitle = htmlspecialchars($ogTitle, ENT_QUOTES, 'UTF-8');
$ogDescription = htmlspecialchars($ogDescription, ENT_QUOTES, 'UTF-8');
$ogImage = htmlspecialchars($ogImage, ENT_QUOTES, 'UTF-8');
$ogUrl = htmlspecialchars('https://academiqr.com' . $_SERVER['REQUEST_URI'], ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><?= $ogTitle ?> | AcademiQR</title>
  <meta name="description" content="<?= $ogDescription ?>">
  <meta property="og:title" content="<?= $ogTitle ?>">
  <meta property="og:description" content="<?= $ogDescription ?>">
  <meta property="og:image" content="<?= $ogImage ?>">
  <meta property="og:url" content="<?= $ogUrl ?>">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="<?= $ogTitle ?>">
  <meta name="twitter:description" content="<?= $ogDescription ?>">
  <meta name="twitter:image" content="<?= $ogImage ?>">
</head>
<body>
  <p>Redirecting...</p>
  <script>window.location.href = "<?= $ogUrl ?>";</script>
</body>
</html>
