BUSINESS LANDING PAGE  (HTML5 + CSS3 + JavaScript + React + PHP)
================================================================

FOLDER STRUCTURE
  index.php                 Page shell (PHP). React renders inside #root.
  assets/style.css          All styling (clip-path polygons, layered shapes).
  assets/app.js             React components: Navbar, Hero, About, Team, FAQ, ContactForm.
  assets/images/hero-photo.jpg   The office photo shown on the right.
  api/contact.php           Contact form endpoint (validates + saves messages).
  storage/                  Created messages go to storage/messages.jsonl
                            (web access to this folder is blocked by .htaccess).

RUN IT LOCALLY WITH XAMPP
  1. Install XAMPP (https://www.apachefriends.org) with Apache + PHP 7.4 or newer.
  2. Copy this whole folder to:   C:\xampp\htdocs\business-landing
  3. Open the XAMPP Control Panel and click Start next to Apache.
  4. In your browser open:        http://localhost/business-landing/

  Do NOT open index.php by double-clicking it. PHP only runs through Apache,
  and the contact form needs it.

EDIT WITH VISUAL STUDIO CODE
  File > Open Folder... and pick the business-landing folder (or the copy in htdocs).
  Edit, save, refresh the browser. There is no build step.

INTERNET NOTE
  React loads from a CDN first. If that is unavailable, the copy in
  assets/vendor/ is used automatically, so the page also works offline.
  Only the Montserrat font needs internet (it falls back to Segoe UI / Arial).

SITE DETAILS (index.php)
  Edit the constants at the top of index.php: title, description, theme colour,
  and SITE_URL (your live address, with a trailing slash) for canonical and
  share-preview tags. The page also sends security headers (CSP, X-Frame-Options,
  Referrer-Policy). If you add a new external script, font or image host, add it
  to the Content-Security-Policy line in index.php or the browser will block it.

REPLACE THE PHOTO
  assets/images/hero-photo.jpg is a placeholder illustration. Drop your own
  photo in with the same file name:
    - landscape, at least 1600 x 1200 pixels, JPG, under about 400 KB
    - an unedited photo (the purple fade and diagonal cut are done in CSS)
    - best with the main person on the right half, a bit left of the edge
  If the person is cut off or too far left/right, change --photo-pos at the
  top of assets/style.css (for example 60% center or 85% center).

EDIT YOUR TEXT
  Open assets/app.js and change the SITE object at the top: brand name, hero
  text, About, Team, FAQ and contact details. You do not need to touch the
  components below it.

CONTACT FORM
  - Checks name (2-80 chars), email (valid format) and message (10-2000 chars)
    in the browser AND again in PHP.
  - Includes a hidden honeypot field, a session token (CSRF check) and a
    10 second rate limit per visitor.
  - Saved messages: storage/messages.jsonl (one JSON object per line).
  - To get emails instead: open api/contact.php, set SEND_EMAIL to true and
    TO_EMAIL to your address. XAMPP needs a configured mail server for this
    (see php.ini [mail function] / sendmail.ini).

TROUBLESHOOTING
  - Page is blank or you see raw PHP code: the address must start with
    http://localhost/ (NOT file:///), Apache must be running, and the whole
    folder must be copied, including assets/vendor/ and assets/images/.
  - Blank page: open the browser console (F12). A message about
    "Content Security Policy" means a new external file needs allowing in index.php.
  - "Could not reach the server": Apache is not running, or the page was
    opened as file:// instead of http://localhost/...
  - "The message could not be saved": make sure the storage folder is writable.

The nav links (Home, FAQ, Team, Contacts, About) scroll smoothly to their
sections, and READ MORE scrolls to About.
