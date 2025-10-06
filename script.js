// START OF FILE script.js

// --- Main application logic function ---
function initializePageLogic() {
    // --- Elements and Initial setup ---
    const allToolCards = Array.from(document.querySelectorAll('.tool-card-home'));
    const tabButtons = document.querySelectorAll('.tab-btn');
    const featureHighlights = document.getElementById('featureHighlights');
    const allToolsTitle = document.getElementById('allToolsTitle');
    const filterTabs = document.getElementById('filterTabs');
    const homeHero = document.getElementById('homeHero');
    const toolGrid = document.getElementById('toolGrid');

    const favoritesSection = document.getElementById('favoritesSection');
    const favoritesGrid = document.getElementById('favoritesGrid');
    const favoritesKey = 'TulvaaFavourites';

    // NEW element for "Not Found" message
    const searchResultsMessage = document.getElementById('searchResultsMessage');

    // --- Search Logic (Homepage Specific) ---
    // Get the new header search input from the loaded header component
    const headerSearchInput = document.getElementById('headerSearchInput');

    // Refactored: This function now only handles filtering on the current page (homepage).
    function performInPlaceSearch(query) {
        const lowerCaseQuery = query.toLowerCase().trim();

        // 1. Reset UI state for empty query
        if (lowerCaseQuery.length === 0) {
            searchResultsMessage.style.display = 'none'; // Hide "Not Found" message
            // Show regular content when search is empty
            if (getFavorites().length === 0) {
                featureHighlights.style.display = 'flex';
            }
            allToolsTitle.style.display = 'block';
            filterTabs.style.display = 'flex';
            favoritesSection.style.display = getFavorites().length > 0 ? 'block' : 'none';
            updateToolVisibility(); // Restore category filtering
            return;
        }

        // 2. Hide sections during search
        featureHighlights.style.display = 'none';
        allToolsTitle.style.display = 'none';
        filterTabs.style.display = 'none';
        favoritesSection.style.display = 'none';

        // 3. Perform filtering and count results
        let resultsFound = false;
        allToolCards.forEach(card => {
            const keywords = card.dataset.keywords.toLowerCase();
            const title = card.querySelector('.tool-title').textContent.toLowerCase();
            if (keywords.includes(lowerCaseQuery) || title.includes(lowerCaseQuery)) {
                card.style.display = 'block';
                resultsFound = true;
            } else {
                card.style.display = 'none';
            }
        });

        // 4. Show "Not Found" message if no results found
        if (resultsFound) {
            searchResultsMessage.style.display = 'none';
        } else {
            searchResultsMessage.style.display = 'block';
        }
    }
    // Make performInPlaceSearch available globally for load-components.js to call
    window.performInPlaceSearch = performInPlaceSearch;


    // --- Handle search query from URL on page load ---
    function checkURLForSearchQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        const initialQuery = urlParams.get('search');
        if (initialQuery) {
            // Set the search input value to match the query in the URL
            if (headerSearchInput) {
                headerSearchInput.value = initialQuery;
            }
            performInPlaceSearch(initialQuery);
        }
    }

    // --- Filter Tabs Logic ---
    function updateToolVisibility() {
        const activeTab = document.querySelector('.tab-btn.active').dataset.filter;
        allToolCards.forEach(card => {
            if (activeTab === 'all' || card.dataset.category === activeTab) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateToolVisibility();
        });
    });

    // --- Favourites Logic ---
    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(favoritesKey) || '[]');
        } catch {
            return [];
        }
    }

    function saveFavorites(favoritesList) {
        localStorage.setItem(favoritesKey, JSON.stringify(favoritesList));
        renderFavorites(); // Update UI after saving
    }

    function renderFavorites() {
        const favorites = getFavorites();
        favoritesGrid.innerHTML = ''; // Clear existing favorites list

        if (favorites.length > 0) {
            favoritesSection.style.display = 'block';
            // UI/UX Improvement: Hide feature highlights when favorites are displayed
            featureHighlights.style.display = 'none';
            homeHero.style.display = 'block'; // Keep search bar visible (now in header)

            // Iterate over the source list (allToolCards) to create clones for the favorites section
            allToolCards.forEach(originalCard => {
                const toolId = originalCard.dataset.toolId;
                if (favorites.includes(toolId)) {
                    // Clone the card for display in the favorites section
                    const clonedCard = originalCard.cloneNode(true);

                    // --- FIX: Ensure the cloned card's icon state is set correctly ---
                    const clonedButton = clonedCard.querySelector('.favorite-btn');
                    if (clonedButton) {
                        // Apply active state to the cloned card's button
                        clonedButton.classList.add('active');
                        // Re-attach listener to the cloned button to avoid state issues on re-renders
                        clonedButton.removeEventListener('click', handleFavoriteClick);
                        clonedButton.addEventListener('click', handleFavoriteClick);
                    }
                    // -----------------------------------------------------------------
                    favoritesGrid.appendChild(clonedCard);
                }
            });
        } else {
            favoritesSection.style.display = 'none';
            featureHighlights.style.display = 'flex'; // Restore feature highlights if no favorites
            homeHero.style.display = 'block'; // Restore main hero section
        }

        // Update icons on all original cards (for visual consistency)
        allToolCards.forEach(card => updateFavoriteIconState(card));
    }

    function updateFavoriteIconState(card) {
        const toolId = card.dataset.toolId;
        const button = card.querySelector('.favorite-btn');
        if (button) {
            if (getFavorites().includes(toolId)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    }

    function toggleFavorite(toolId) {
        let favorites = getFavorites();
        const index = favorites.indexOf(toolId);

        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(toolId);
        }
        saveFavorites(favorites);
    }

    function handleFavoriteClick(event) {
        event.preventDefault();
        event.stopPropagation();
        const toolId = event.currentTarget.dataset.toolId;
        toggleFavorite(toolId);
    }

    // --- Add event listeners for favorite buttons ---
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', handleFavoriteClick);
    });

    // --- Initial Setup ---
    renderFavorites(); // Load and display favorites on page load
    updateToolVisibility(); // Initial filter call
    checkURLForSearchQuery(); // Check URL for search query on page load
}

// NOTE: Initialization now happens from load-components.js AFTER header/footer load

// END OF FILE: script.js