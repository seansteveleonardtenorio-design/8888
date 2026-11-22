<?php
declare(strict_types=1);
/**
 * index.php - page shell. React renders everything inside #root (see assets/app.js).
 * Edit the constants below for your site details.
 */

const SITE_TITLE       = 'Business Landing Page';
const SITE_DESCRIPTION = 'Business landing page with services, team, FAQ and a contact form.';
const THEME_COLOR      = '#b05bd0';
// Full address of the live site, with a trailing slash (e.g. 'https://example.com/').
// Leave empty while testing on localhost. When set, canonical and share-preview tags are added.
const SITE_URL         = '';

$https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';

// Session holds the form's CSRF token.
session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'secure' => $https]);
session_start();
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(16));
}

/** Escape text for HTML output. */
function e(string $text): string
{
    return htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** File path plus a version number, so browsers reload it when you edit the file. */
function asset(string $path): string
{
    $file = __DIR__ . '/' . $path;
    return $path . '?v=' . (is_file($file) ? filemtime($file) : 1);
}

// ---- Security headers ----
$nonce = base64_encode(random_bytes(16));
header_remove('X-Powered-By');
header('Cache-Control: private, no-cache'); // the page carries a per-visitor token
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
if ($https) {
    header('Strict-Transport-Security: max-age=31536000');
}
header(
    "Content-Security-Policy: default-src 'self'; " .
    "script-src 'self' 'nonce-{$nonce}' https://cdnjs.cloudflare.com; " .
    "style-src 'self' https://fonts.googleapis.com; " .
    "font-src https://fonts.gstatic.com; " .
    "img-src 'self' data:; " .
    "connect-src 'self'; " .
    "form-action 'self'; base-uri 'self'; frame-ancestors 'none'"
);

$config = [
    'contactEndpoint' => 'api/contact.php',
    'csrf'            => $_SESSION['csrf'],
    'year'            => (int) date('Y'),
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e(SITE_TITLE) ?></title>
  <meta name="description" content="<?= e(SITE_DESCRIPTION) ?>">
  <meta name="theme-color" content="<?= e(THEME_COLOR) ?>">
  <meta property="og:type" content="website">
  <meta property="og:title" content="<?= e(SITE_TITLE) ?>">
  <meta property="og:description" content="<?= e(SITE_DESCRIPTION) ?>">
  <meta name="twitter:card" content="summary_large_image">
<?php if (SITE_URL !== ''): ?>
  <link rel="canonical" href="<?= e(SITE_URL) ?>">
  <meta property="og:url" content="<?= e(SITE_URL) ?>">
  <meta property="og:image" content="<?= e(SITE_URL) ?>assets/images/hero-photo.jpg">
<?php endif; ?>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%237d2a93'/%3E%3Cpath d='M6 24 16 6l10 18z' fill='%23fff' opacity='.9'/%3E%3C/svg%3E">

  <!-- Start loading the hero photo and fonts early -->
  <link rel="preload" as="image" href="assets/images/hero-photo.jpg" fetchpriority="high">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(asset('assets/style.css')) ?>">
</head>
<body>
  <a class="skip-link" href="#about">Skip to content</a>
  <div id="root"></div>
  <noscript><p class="noscript">This page needs JavaScript to run.</p></noscript>

  <script nonce="<?= e($nonce) ?>">window.APP_CONFIG = <?= json_encode($config, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;</script>

  <!-- React from the CDN; if that fails (offline, blocked), the local copy in assets/vendor/ is used -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js" crossorigin></script>
  <script nonce="<?= e($nonce) ?>">window.React || document.write('<script src="assets/vendor/react.production.min.js"><\/script>');</script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js" crossorigin></script>
  <script nonce="<?= e($nonce) ?>">window.ReactDOM || document.write('<script src="assets/vendor/react-dom.production.min.js"><\/script>');</script>

  <script src="<?= e(asset('assets/app.js')) ?>"></script>
  <script nonce="<?= e($nonce) ?>">
    // If nothing rendered (a script failed to load), say so instead of showing a blank page.
    if (!document.getElementById('root').children.length) {
      document.getElementById('root').innerHTML =
        '<p class="noscript">The page could not start. Press F12 and check the Console tab for the error, ' +
        'and make sure the folder assets/ (with app.js, style.css and vendor/) was copied completely.</p>';
    }
  </script>
</body>
</html>
