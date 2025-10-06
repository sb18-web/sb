// START OF FILE: js/load-components.js (Updated with bottom nav logic)

async function loadDynamicContent() {
    // 1. Load Header content from includes/header.html into placeholder div
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch('/includes/header.html');
            const headerHtml = await response.text();
            headerPlaceholder.innerHTML = headerHtml;
            setupNavigationListeners(); // Call navigation listeners first
            setupThemeToggle();
            setupUniversalSearchLogic(); // Then set up search logic after header content is loaded
        } catch (error) {
            console.error('Failed to load header content:', error);
        }
    }

    // 2. Load Footer content from includes/footer.html into placeholder div
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const response = await fetch('/includes/footer.html');
            const footerHtml = await response.text();
            footerPlaceholder.innerHTML = footerHtml;
        } catch (error) {
            console.error('Failed to load footer content:', error);
        }
    }

    // NEW: 3. Load Bottom Navigation content from includes/bottom-nav.html into placeholder div
    const bottomNavPlaceholder = document.getElementById('bottom-nav-placeholder');
    if (bottomNavPlaceholder) {
        try {
            const response = await fetch('/includes/bottom-nav.html');
            const bottomNavHtml = await response.text();
            bottomNavPlaceholder.innerHTML = bottomNavHtml;
            setupBottomNavListeners(); // Call listeners for the new bottom nav buttons
        } catch (error) {
            console.error('Failed to load bottom navigation content:', error);
        }
    }

    // 4. Initialize main page logic AFTER all components are loaded
    setTimeout(() => {
        if (typeof initializePageLogic === "function") {
            initializePageLogic();
        }
    }, 0);
}

// --- Universal Search Logic (Live Suggestions + Redirection) ---
function setupUniversalSearchLogic() {
    const headerSearchInput = document.getElementById('headerSearchInput');
    const searchResultsDropdown = document.getElementById('searchResultsDropdown');
    const allToolsMenu = document.getElementById('allToolsMenu');

    // Tool Data List (Updated with 'type' field)
    const allToolsData = [
        // --- Client-side tools ---
        { name: "Image to PDF", url: "/tools/image-to-pdf.html", keywords: ["image", "pdf", "convert"], type: "client" },
        { name: "Image Compressor", url: "/tools/image-compressor.html", keywords: ["image", "compress", "resize"], type: "client" },
        { name: "Image Resizer", url: "/tools/image-resizer.html", keywords: ["image", "resize", "scale"], type: "client" },
        { name: "PNG <> JPG Converter", url: "/tools/convert-png-jpg.html", keywords: ["image", "png", "jpg", "convert"], type: "client" },
        { name: "Steganography", url: "/tools/steganography.html", keywords: ["image", "hide", "secret"], type: "client" },
        { name: "Palette Extractor", url: "/tools/image-palette-extractor.html", keywords: ["image", "color", "palette"], type: "client" },
        { name: "Placeholder Generator", url: "/tools/image-placeholder-generator.html", keywords: ["image", "placeholder", "generate"], type: "client" },
        { name: "Text Diff Checker", url: "/tools/text-diff.html", keywords: ["text", "compare", "diff"], type: "client" },
        { name: "Word Counter", url: "/tools/word-counter.html", keywords: ["text", "word", "count"], type: "client" },
        { name: "Text Encryptor", url: "/tools/text-encryptor.html", keywords: ["text", "encrypt", "password"], type: "client" },
        { name: "Text to PDF", url: "/tools/text-to-pdf.html", keywords: ["text", "pdf", "convert"], type: "client" },
        { name: "Line Operations", url: "/tools/line-operations.html", keywords: ["text", "sort", "shuffle"], type: "client" },
        { name: "Text Cleaner", url: "/tools/text-cleaner.html", keywords: ["text", "clean", "format"], type: "client" },
        { name: "Delivery Note Generator", url: "/tools/delivery-note-generator.html", keywords: ["text", "delivery", "note", "challan"], type: "client" },
        { name: "Unit Converter", url: "/tools/unit-converter.html", keywords: ["convert", "unit", "length", "weight"], type: "client" },
        { name: "Document Scanner", url: "/tools/document-scanner.html", keywords: ["convert", "document", "scan", "pdf"], type: "client" },
        { name: "CSV Editor", url: "/tools/csv-editor.html", keywords: ["convert", "csv", "editor", "spreadsheet"], type: "client" },
        { name: "Calculator", url: "/tools/calculator.html", keywords: ["convert", "calculator", "math"], type: "client" },
        { name: "PDF Editor", url: "/tools/pdf-editor.html", keywords: ["convert", "pdf", "edit", "merge", "split"], type: "client" },
        { name: "QR & Barcode Reader", url: "/tools/qr-reader.html", keywords: ["encode", "qr", "barcode", "scan"], type: "client" },
        { name: "URL Encoder", url: "/tools/url-encoder.html", keywords: ["encode", "url"], type: "client" },
        { name: "Hash Generator", url: "/tools/hash-generator.html", keywords: ["encode", "hash", "md5", "sha"], type: "client" },
        { name: "Password Manager", url: "/tools/password-manager.html", keywords: ["encode", "password", "manager"], type: "client" },
        { name: "Password Generator", url: "/tools/password-generator.html", keywords: ["encode", "password", "generate"], type: "client" },
        { name: "QR Generator", url: "/tools/qr-generator.html", keywords: ["encode", "qr", "generate"], type: "client" },
        { name: "PWA Manifest Generator", url: "/tools/pwa-manifest-generator.html", keywords: ["encode", "pwa", "manifest"], type: "client" },
        { name: "Image to Prompt (AI)", url: "/tools/image-to-prompt.html", keywords: ["ai", "image", "prompt"], type: "client" },
        { name: "JSON Formatter", url: "/tools/json-formatter.html", keywords: ["ai", "json", "formatter"], type: "client" },
        { name: "HTML Viewer", url: "/tools/html-viewer.html", keywords: ["ai", "html", "code", "viewer"], type: "client" }
    ];

    if (headerSearchInput) {
        // --- Get current page status ---
        const isOnHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';

        // --- Live Suggestions Logic ---
        headerSearchInput.addEventListener('input', () => {
            const query = headerSearchInput.value.trim().toLowerCase();

            // When user types, perform filtering regardless of page type
            if (isOnHomePage) {
                // If on homepage, perform in-place filtering via script.js.
                if (typeof performInPlaceSearch === "function") {
                    performInPlaceSearch(query);
                }
            }

            // Always render suggestions for non-empty query in the dropdown.
            if (query.length > 0) {
                const matchingTools = allToolsData.filter(tool => {
                    const searchString = tool.name.toLowerCase() + ' ' + (tool.keywords ? tool.keywords.join(' ') : '');
                    return searchString.includes(query);
                }).slice(0, 5); // Show top 5 results

                renderSuggestions(matchingTools, query);
            } else {
                searchResultsDropdown.style.display = 'none';
            }
        });

        // --- Redirection Logic (on Enter key or when suggestions are clicked) ---
        headerSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent default form submission

                const query = headerSearchInput.value.trim();

                // On homepage, perform in-place filtering.
                if (isOnHomePage) {
                    if (typeof performInPlaceSearch === "function") {
                        performInPlaceSearch(query);
                    }
                } else if (query.length > 0) {
                    // On non-homepage, redirect to homepage with query for full results display.
                    window.location.href = `/index.html?search=${encodeURIComponent(query)}`;
                } else if (query.length === 0 && window.location.search.includes('search=')) {
                    // Clear search and redirect back to clean homepage URL
                    window.location.href = `/index.html`;
                }
            }
        });

        // --- FIX: Close dropdown when clicking outside and when mobile menu opens/closes ---
        document.addEventListener('click', (event) => {
            const clickedOutsideSearch = !headerSearchInput.contains(event.target) && !searchResultsDropdown.contains(event.target);
            if (searchResultsDropdown.style.display === 'block' && clickedOutsideSearch) {
                searchResultsDropdown.style.display = 'none';
            }
        });

        // --- Render Suggestions UI ---
        function renderSuggestions(matches, query) {
            // Check if user is on mobile and mega menu is open
            const isMegaMenuOpen = allToolsMenu.classList.contains('show');

            if (query.length === 0 || matches.length === 0) {
                searchResultsDropdown.style.display = 'none';
                return;
            }

            searchResultsDropdown.innerHTML = '';
            const ul = document.createElement('ul');
            ul.className = 'suggestions-list';

            matches.forEach(tool => {
                const li = document.createElement('li');
                li.className = 'suggestion-item';
                li.textContent = tool.name;
                li.dataset.url = tool.url;

                li.addEventListener('click', () => {
                    window.location.href = tool.url;
                });
                ul.appendChild(li);
            });

            searchResultsDropdown.appendChild(ul);
            
            // FIX: Ensure suggestions show up only if mega menu is closed on mobile.
            if (window.innerWidth <= 900) {
                 // On mobile, if mega menu is open, search suggestions should be hidden to avoid overlap.
                 // If a user clicks search input when menu is open, suggestions won't appear until menu is closed.
                 if (!isMegaMenuOpen) {
                    searchResultsDropdown.style.display = 'block';
                 } else {
                    searchResultsDropdown.style.display = 'none';
                 }
            } else {
                 searchResultsDropdown.style.display = 'block'; // Always show on desktop
            }
        }
    }
}


// --- Initialization functions for new injected content ---

// NEW FUNCTION: Setup listeners for bottom navigation buttons
function setupBottomNavListeners() {
    const bottomNavAllToolsBtn = document.getElementById('bottomNavAllToolsBtn');
    const bottomNavFavoritesBtn = document.getElementById('bottomNavFavoritesBtn');
    const allToolsMenu = document.getElementById('allToolsMenu');

    // Toggle mega menu via bottom nav button
    if (bottomNavAllToolsBtn) {
        bottomNavAllToolsBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            allToolsMenu.classList.toggle('show');
            document.body.classList.toggle('menu-open');
        });
    }

    // Scroll to favorites section on bottom nav click
    if (bottomNavFavoritesBtn) {
        bottomNavFavoritesBtn.addEventListener('click', () => {
            // Ensure we are on the homepage before attempting to scroll
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                const favoritesSection = document.getElementById('favoritesSection');
                if (favoritesSection) {
                    // Smooth scroll to element
                    favoritesSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Redirect to homepage first, then scroll (using URL parameter, handled by script.js)
                window.location.href = '/index.html#favorites';
            }
        });
    }
}


function setupNavigationListeners() {
    // ... (unchanged navigation code for desktop and mobile menu logic) ...
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const allToolsBtn = document.getElementById('allToolsBtn');
    const allToolsMenu = document.getElementById('allToolsMenu');

    // Toggle logic for hamburger menu (mobile) and all tools button (desktop)
    const toggleMenu = (event) => {
        event.stopPropagation();
        const isDesktopView = window.innerWidth > 900;

        if (isDesktopView) {
            allToolsMenu.classList.toggle('show');
            allToolsBtn.classList.toggle('open');
            // FIX: Close search suggestions when menu opens/closes
            document.getElementById('searchResultsDropdown').style.display = 'none';
        } else {
            // Mobile logic (side drawer toggle)
            allToolsMenu.classList.toggle('show');
            document.body.classList.toggle('menu-open');
            // FIX: Close search suggestions when menu opens/closes
            document.getElementById('searchResultsDropdown').style.display = 'none';
        }
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }
    if (allToolsBtn) {
        allToolsBtn.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isDesktopView = window.innerWidth > 900;
        const clickedOutsideMenu = !allToolsMenu.contains(event.target) && !event.target.closest('.main-nav');
        const searchInput = document.getElementById('headerSearchInput');

        if (isDesktopView) {
            if (allToolsMenu.classList.contains('show') && clickedOutsideMenu) {
                allToolsMenu.classList.remove('show');
                allToolsBtn.classList.remove('open');
            }
        } else {
            // On mobile: if menu is open and we click outside, close it.
            if (allToolsMenu.classList.contains('show') && clickedOutsideMenu && event.target !== hamburgerBtn) {
                allToolsMenu.classList.remove('show');
                document.body.classList.remove('menu-open');
            }
        }
    });

    // Handle initial state based on screen size (e.g., ensure correct display on resize)
    function checkScreenSize() {
        if (window.innerWidth > 900) {
            document.body.classList.remove('menu-open');
        } else {
            if (allToolsMenu.classList.contains('show')) {
                document.body.classList.add('menu-open');
            }
        }
    }
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize(); // Initial check on load
}

function setupThemeToggle() {
    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    function setInitialTheme() {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            body.setAttribute("data-theme", "dark");
            if (themeToggle) themeToggle.textContent = "☀️";
        } else if (savedTheme === "black") {
            body.setAttribute("data-theme", "black");
            if (themeToggle) themeToggle.textContent = "🌑";
        } else {
            body.removeAttribute("data-theme");
            if (themeToggle) themeToggle.textContent = "🌙";
        }
    }
    setInitialTheme();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = localStorage.getItem("theme") || "light";
            if (currentTheme === "light") {
                body.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
                themeToggle.textContent = "☀️";
            } else if (currentTheme === "dark") {
                body.setAttribute("data-theme", "black");
                localStorage.setItem("theme", "black");
                themeToggle.textContent = "🌑";
            } else {
                body.removeAttribute("data-theme");
                localStorage.setItem("theme", "light");
                themeToggle.textContent = "🌙";
            }
        });
    }
}

// Ensure loadDynamicContent runs after the page has finished loading
document.addEventListener('DOMContentLoaded', loadDynamicContent);