<?php
// Custom 404 for any path that isn't a real file or directory.
// .htaccess rewrites unknown paths here because this host ignores ErrorDocument.
http_response_code(404);
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-store');
readfile(__DIR__ . '/404.html');
