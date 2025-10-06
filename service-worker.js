// START OF FILE: service-worker.js (Updated with all external libraries)

const CACHE_NAME = 'Tulvaa-cache-v1';
const urlsToCache = [
  '/', // Root directory
  '/index.html',
  '/style.css',
  '/js/load-components.js', // NEW: Added component loader script
  '/js/theme.js',
  '/js/script.js',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/disclaimer.html',
  '/blog.html',

  // All tool pages:
  '/tools/image-to-pdf.html',
  '/tools/image-compressor.html',
  '/tools/image-resizer.html',
  '/tools/convert-png-jpg.html',
  '/tools/steganography.html',
  '/tools/image-palette-extractor.html',
  '/tools/image-placeholder-generator.html',
  '/tools/text-diff.html',
  '/tools/text-encryptor.html',
  '/tools/text-to-pdf.html',
  '/tools/word-counter.html',
  '/tools/line-operations.html',
  '/tools/text-cleaner.html',
  '/tools/delivery-note-generator.html',
  '/tools/unit-converter.html',
  '/tools/document-scanner.html',
  '/tools/url-encoder.html',
  '/tools/hash-generator.html',
  '/tools/password-manager.html',
  '/tools/password-generator.html',
  '/tools/qr-generator.html',
  '/tools/pwa-manifest-generator.html',
  '/tools/image-to-prompt.html',
  '/tools/json-formatter.html',
  '/tools/html-viewer.html',
  '/tools/csv-editor.html',
  '/tools/calculator.html',
  '/tools/pdf-editor.html',

  // External resources (for specific tools):
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', // Used by image-to-pdf, delivery-note-generator, qr-generator, text-to-pdf
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', // Used by delivery-note-generator
  'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.css', // Used by image-to-pdf
  'https://cdnjs.cloudflare.com/ajax/libs/diff-match-patch/20121119/diff_match_patch.js', // Used by text-diff
  'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js', // Used by password-manager, text-encryptor (or steganography)
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js', // Used by qr-generator
  'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js', // Used by qr-generator
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', // Used by document-scanner, qr-generator
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', // Used by pdf-editor
  'https://unpkg.com/pdf-lib/dist/pdf-lib.min.js' // Used by pdf-editor
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Error adding files to cache:', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => {
        if (!cacheWhitelist.includes(cacheName)) {
          return caches.delete(cacheName);
        }
      })
    ))
  );
});
// END OF FILE: service-worker.js
