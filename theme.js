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

// --- PWA Install Button Logic ---
const installButton = document.getElementById('installButton');
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installButton) installButton.style.display = 'block';
});

if (installButton) {
  installButton.addEventListener('click', () => {
    installButton.style.display = 'none';
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log('User response to install prompt:', choiceResult.outcome);
        deferredPrompt = null;
      });
    }
  });
  window.addEventListener('appinstalled', () => installButton.style.display = 'none');
}

// --- Common Navigation Logic (for all pages) ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const allToolsMenu = document.getElementById('allToolsMenu');
    const allToolsBtn = document.getElementById('allToolsBtn'); // For desktop mega-menu toggle if present

    // Toggle logic for hamburger menu (mobile) and all tools button (desktop)
    const toggleMenu = (event) => {
        event.stopPropagation();
        allToolsMenu.classList.toggle('show');
        document.body.classList.toggle('menu-open');
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }
    if (allToolsBtn) {
        allToolsBtn.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking outside (on desktop view only)
    document.addEventListener('click', (event) => {
        const isDesktopView = window.innerWidth > 900;
        const clickedOutsideMenu = !allToolsMenu.contains(event.target) && !event.target.closest('.main-nav');

        if (isDesktopView) {
            if (allToolsMenu.classList.contains('show') && clickedOutsideMenu) {
                allToolsMenu.classList.remove('show');
            }
        } else {
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
        }
    }
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize(); // Initial check on load
});
