<?php
/**
 * api/contact.php - receives the contact form (JSON or regular form post),
 * validates it, and saves it to storage/messages.jsonl.
 * Optional: set SEND_EMAIL to true and TO_EMAIL to your address
 * (needs a working mail setup, which XAMPP does not have by default).
 */
declare(strict_types=1);

const SAVE_TO_FILE = true;
const SEND_EMAIL   = false;
const TO_EMAIL     = 'you@example.com';
const MIN_SECONDS_BETWEEN_MESSAGES = 10;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

// Never print PHP errors into the JSON response; return a clean message instead.
ini_set('display_errors', '0');
set_exception_handler(function (Throwable $e): void {
    error_log('contact.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Server error. Please try again later.']);
});

/** Character count that works with or without the mbstring extension. */
function text_length(string $text): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($text, 'UTF-8');
    }
    return (int) preg_match_all('/./su', $text);
}

function respond(int $code, array $payload): void
{
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function clean($value): string
{
    if (!is_string($value)) {
        return '';
    }
    // Strip control characters (keep tab/newline), then trim.
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value) ?? '';
    return trim($value);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'Method not allowed.']);
}

// Accept JSON (what the React form sends) or a classic form post.
$data = $_POST;
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $data = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($data)) {
        respond(400, ['ok' => false, 'message' => 'Invalid request.']);
    }
}

session_start();
$token = clean($data['csrf'] ?? '');
if (empty($_SESSION['csrf']) || !hash_equals((string) $_SESSION['csrf'], $token)) {
    respond(403, ['ok' => false, 'message' => 'Your session expired. Reload the page and try again.']);
}

$name    = clean($data['name'] ?? '');
$email   = clean($data['email'] ?? '');
$message = clean($data['message'] ?? '');
$trap    = clean($data['website'] ?? '');

// Honeypot: pretend success so bots learn nothing.
if ($trap !== '') {
    respond(200, ['ok' => true, 'message' => 'Thanks! Your message has been sent.']);
}

$errors = [];
$nameLen = text_length($name);
$msgLen  = text_length($message);

if ($nameLen < 2 || $nameLen > 80) {
    $errors['name'] = 'Enter your name (2 to 80 characters).';
}
if ($email === '' || strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Enter a valid email address.';
}
if ($msgLen < 10 || $msgLen > 2000) {
    $errors['message'] = 'Write a message between 10 and 2000 characters.';
}
if ($errors) {
    respond(422, ['ok' => false, 'message' => 'Please fix the highlighted fields.', 'errors' => $errors]);
}

// Basic rate limit: one message every few seconds per visitor.
$now = time();
if (isset($_SESSION['last_contact']) && ($now - (int) $_SESSION['last_contact']) < MIN_SECONDS_BETWEEN_MESSAGES) {
    respond(429, ['ok' => false, 'message' => 'Please wait a few seconds before sending another message.']);
}

$saved = false;
$mailed = false;

if (SAVE_TO_FILE) {
    $dir = dirname(__DIR__) . '/storage';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    if (is_dir($dir)) {
        $htaccess = $dir . '/.htaccess';
        if (!file_exists($htaccess)) {
            @file_put_contents($htaccess, "Require all denied\n");
        }
        $line = json_encode([
            'time'    => date('c'),
            'ip'      => $_SERVER['REMOTE_ADDR'] ?? '',
            'name'    => $name,
            'email'   => $email,
            'message' => $message,
        ], JSON_UNESCAPED_UNICODE) . "\n";
        $saved = @file_put_contents($dir . '/messages.jsonl', $line, FILE_APPEND | LOCK_EX) !== false;
    }
}

if (SEND_EMAIL) {
    $safeName  = str_replace(["\r", "\n"], ' ', $name);
    $safeEmail = str_replace(["\r", "\n"], '', $email);
    $headers   = "From: no-reply@localhost\r\nReply-To: {$safeEmail}\r\nContent-Type: text/plain; charset=utf-8";
    $body      = "Name: {$safeName}\nEmail: {$safeEmail}\n\n{$message}\n";
    $mailed    = @mail(TO_EMAIL, 'New contact form message', $body, $headers);
}

if (!$saved && !$mailed) {
    respond(500, ['ok' => false, 'message' => 'The message could not be saved. Check that the storage folder is writable.']);
}

$_SESSION['last_contact'] = $now;
respond(200, ['ok' => true, 'message' => 'Thanks! Your message has been sent.']);
