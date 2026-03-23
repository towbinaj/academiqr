<?php
/**
 * AcademiQR — Open Graph meta tag server for social media crawlers
 *             + full SSR HTML for search engine bots
 *
 * Apache rewrites social crawler requests to this file, which fetches
 * collection data from Supabase and returns HTML with proper OG tags.
 * Search engine bots get a full HTML page with structured data.
 * Regular browsers get redirected to the SPA (public.html).
 *
 * Place in the web root alongside public.html.
 * Requires the .htaccess rewrite rules to route crawler traffic here.
 */

// Supabase config
$SUPABASE_URL = 'https://natzpfyxpuycsuuzbqrd.supabase.co';
$SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHpwZnl4cHV5Y3N1dXpicXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2ODEwMDgsImV4cCI6MjAzOTI1NzAwOH0.oBMY_bAPdBSXrF-kOgKnqFT1sdVd9hUH7ECg0fL5P14';

// Detect user agent type
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

$socialCrawlers = ['facebookexternalhit', 'Twitterbot', 'LinkedInBot', 'Slackbot', 'Discordbot', 'WhatsApp', 'TelegramBot'];
$searchEngineBots = ['Googlebot', 'bingbot', 'DuckDuckBot', 'YandexBot', 'Baiduspider'];

$isSocialCrawler = false;
foreach ($socialCrawlers as $bot) {
    if (stripos($ua, $bot) !== false) {
        $isSocialCrawler = true;
        break;
    }
}

$isSearchEngine = false;
foreach ($searchEngineBots as $bot) {
    if (stripos($ua, $bot) !== false) {
        $isSearchEngine = true;
        break;
    }
}

$isCrawler = $isSocialCrawler || $isSearchEngine;

// If not a crawler, redirect to the SPA
if (!$isCrawler) {
    $path = $_SERVER['REQUEST_URI'];
    header("Location: /public.html" . (strpos($path, '?') !== false ? '?' . parse_url($path, PHP_URL_QUERY) : ''));
    exit;
}

// Parse URL: /u/username/slug or ?user=...&collection=...
$collectionId = null;
$username = null;
$slug = null;
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
$ogImage = 'https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png';
$ownerName = '';
$conference = '';
$eventDate = '';
$linkItems = [];

if ($collectionId) {
    // Fetch collection
    $collJson = file_get_contents("$SUPABASE_URL/rest/v1/link_lists?id=eq.$collectionId&select=presentation_data,owner_id", false,
        stream_context_create(['http' => ['header' => "apikey: $SUPABASE_ANON_KEY\r\nAuthorization: Bearer $SUPABASE_ANON_KEY"]]));
    $collections = json_decode($collJson, true);

    if ($collections && count($collections) > 0) {
        $coll = $collections[0];
        $pd = $coll['presentation_data'] ?? [];
        $ogTitle = $pd['title'] ?? 'AcademiQR Collection';
        $conference = $pd['conference'] ?? '';
        $eventDate = $pd['event_date'] ?? '';

        $parts = [];

        // Fetch profile for display name + photo
        $ownerId = $coll['owner_id'];
        $profJson = file_get_contents("$SUPABASE_URL/rest/v1/profiles?id=eq.$ownerId&select=display_name,profile_photo", false,
            stream_context_create(['http' => ['header' => "apikey: $SUPABASE_ANON_KEY\r\nAuthorization: Bearer $SUPABASE_ANON_KEY"]]));
        $profs = json_decode($profJson, true);

        if ($profs && count($profs) > 0) {
            if (!empty($profs[0]['display_name'])) {
                $ownerName = $profs[0]['display_name'];
                $parts[] = $ownerName;
            }
            if (!empty($profs[0]['profile_photo']) && !str_starts_with($profs[0]['profile_photo'], 'data:')) {
                $ogImage = $profs[0]['profile_photo'];
            }
        }

        if (!empty($conference)) $parts[] = $conference;
        $ogDescription = count($parts) > 0 ? $ogTitle . ' — ' . implode(' • ', $parts) : $ogTitle;

        // Fetch link items for search engine rendering
        if ($isSearchEngine) {
            $linksJson = file_get_contents(
                "$SUPABASE_URL/rest/v1/link_items?select=title,url,sort_order,is_active&link_list_id=eq.$collectionId&is_active=eq.true&order=sort_order.asc",
                false,
                stream_context_create(['http' => ['header' => "apikey: $SUPABASE_ANON_KEY\r\nAuthorization: Bearer $SUPABASE_ANON_KEY"]])
            );
            $linkItems = json_decode($linksJson, true) ?? [];
        }
    }
}

$ogTitle = htmlspecialchars($ogTitle, ENT_QUOTES, 'UTF-8');
$ogDescription = htmlspecialchars($ogDescription, ENT_QUOTES, 'UTF-8');
$ogImage = htmlspecialchars($ogImage, ENT_QUOTES, 'UTF-8');
$ogUrl = htmlspecialchars('https://academiqr.com' . $_SERVER['REQUEST_URI'], ENT_QUOTES, 'UTF-8');
$canonicalUrl = $ogUrl;

// --- Search Engine Bot: Full SSR HTML ---
if ($isSearchEngine) {
    $ownerNameSafe = htmlspecialchars($ownerName, ENT_QUOTES, 'UTF-8');
    $conferenceSafe = htmlspecialchars($conference, ENT_QUOTES, 'UTF-8');
    $eventDateSafe = htmlspecialchars($eventDate, ENT_QUOTES, 'UTF-8');

    // Build JSON-LD structured data
    $jsonLd = [
        '@context' => 'https://schema.org',
        '@type' => 'CollectionPage',
        'name' => html_entity_decode($ogTitle, ENT_QUOTES, 'UTF-8'),
        'description' => html_entity_decode($ogDescription, ENT_QUOTES, 'UTF-8'),
        'url' => html_entity_decode($canonicalUrl, ENT_QUOTES, 'UTF-8'),
    ];
    if (!empty($ownerName)) {
        $jsonLd['author'] = [
            '@type' => 'Person',
            'name' => $ownerName,
        ];
    }
    if (!empty($conference)) {
        $jsonLd['about'] = [
            '@type' => 'Event',
            'name' => $conference,
        ];
    }
    if (count($linkItems) > 0) {
        $jsonLd['hasPart'] = [];
        foreach ($linkItems as $item) {
            $jsonLd['hasPart'][] = [
                '@type' => 'WebPage',
                'name' => $item['title'] ?? '',
                'url' => $item['url'] ?? '',
            ];
        }
    }
    $jsonLdJson = json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $ogTitle ?> | AcademiQR</title>
  <meta name="description" content="<?= $ogDescription ?>">
  <link rel="canonical" href="<?= $canonicalUrl ?>">

  <!-- Open Graph -->
  <meta property="og:title" content="<?= $ogTitle ?>">
  <meta property="og:description" content="<?= $ogDescription ?>">
  <meta property="og:image" content="<?= $ogImage ?>">
  <meta property="og:url" content="<?= $ogUrl ?>">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="<?= $ogTitle ?>">
  <meta name="twitter:description" content="<?= $ogDescription ?>">
  <meta name="twitter:image" content="<?= $ogImage ?>">

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json"><?= $jsonLdJson ?></script>

  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 720px; margin: 0 auto; padding: 2rem 1rem; color: #1a1a2e; line-height: 1.6; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; color: #16213e; }
    .meta { color: #555; margin-bottom: 1.5rem; }
    .meta p { margin: 0.25rem 0; }
    ul { list-style: none; padding: 0; }
    ul li { padding: 0.75rem 0; border-bottom: 1px solid #eee; }
    ul li a { color: #0f3460; text-decoration: none; font-weight: 500; }
    ul li a:hover { text-decoration: underline; }
    footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ddd; font-size: 0.875rem; color: #777; }
    footer a { color: #0f3460; }
  </style>
</head>
<body>
  <h1><?= $ogTitle ?></h1>

  <div class="meta">
<?php if (!empty($conferenceSafe)): ?>
    <p>Conference / Event: <?= $conferenceSafe ?></p>
<?php endif; ?>
<?php if (!empty($eventDateSafe)): ?>
    <p>Date: <?= $eventDateSafe ?></p>
<?php endif; ?>
<?php if (!empty($ownerNameSafe)): ?>
    <p>By <?= $ownerNameSafe ?></p>
<?php endif; ?>
  </div>

<?php if (count($linkItems) > 0): ?>
  <ul>
<?php foreach ($linkItems as $item):
    $linkTitle = htmlspecialchars($item['title'] ?? 'Untitled', ENT_QUOTES, 'UTF-8');
    $linkUrl = htmlspecialchars($item['url'] ?? '#', ENT_QUOTES, 'UTF-8');
?>
    <li><a href="<?= $linkUrl ?>"><?= $linkTitle ?></a></li>
<?php endforeach; ?>
  </ul>
<?php endif; ?>

  <footer>
    Powered by <a href="https://academiqr.com">AcademiQR</a> — Academic link collections made simple.
  </footer>
</body>
</html>
<?php
    exit;
}

// --- Social Media Crawler: Minimal OG HTML ---
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
