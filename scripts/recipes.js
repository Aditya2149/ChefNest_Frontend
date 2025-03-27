let currentPage = 1;
const recipesPerPage = 10;
let totalRecipes = 0;
let isSearchActive = false;
let currentSearchQuery = '';

document.addEventListener("DOMContentLoaded", function () {
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");
    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("show");
    });

    // Initialize pagination controls
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateRecipesDisplay();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        currentPage++;
        updateRecipesDisplay();
    });

    // Initialize auth state
    updateAuthState();
    
    // Initial fetch
    fetchTotalRecipes().then(() => {
        updateRecipesDisplay();
    });

    // Search setup
    setupSearch();
});

function updateAuthState() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const authLinks = document.getElementById("authLinks");

    if (authLinks) {
        if (token) {
            authLinks.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="recipes.html">Recipes</a></li>
                <li><a href="chefs.html">Chefs</a></li>
                <li class="dropdown">
                    <a href="#">My Account</a>
                    <ul class="dropdown-menu">
                        <li><a href="profile.html">My Profile</a></li>
                        <li><a href="favorites.html">Favorites</a></li>
                        <li><a href="#" id="logoutBtn">Logout</a></li>
                    </ul>
                </li>
            `;

            if (role === "admin") {
                authLinks.innerHTML += `<li><a href="admin-dashboard.html">Admin Panel</a></li>`;
            }

            document.getElementById("logoutBtn")?.addEventListener("click", function () {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                alert("Logged out successfully.");
                window.location.href = "index.html";
            });
        }
    }
}

async function fetchTotalRecipes() {
    try {
        const response = await fetch(`https://chefnest.onrender.com/recipes/count`);
        const data = await response.json();
        totalRecipes = data.count;
    } catch (error) {
        console.error("Error fetching total recipes count:", error);
    }
}

async function updateRecipesDisplay() {
    const loadingElement = document.querySelector(".loading");
    const recipeGrid = document.querySelector(".recipe-grid");
    
    loadingElement.style.display = "flex";
    recipeGrid.innerHTML = "";

    try {
        let url;
        if (isSearchActive && currentSearchQuery) {
            url = `https://chefnest.onrender.com/recipes/search?query=${encodeURIComponent(currentSearchQuery)}&page=${currentPage}&limit=${recipesPerPage}`;
        } else {
            url = `https://chefnest.onrender.com/recipes?page=${currentPage}&limit=${recipesPerPage}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        loadingElement.style.display = "none";

        // Handle both response formats (search returns different structure)
        const recipes = data.recipes || data;
        const total = data.total || totalRecipes;

        if (recipes.length === 0) {
            recipeGrid.innerHTML = `<p class="no-results">No recipes found.</p>`;
            updatePaginationControls(0);
            return;
        }

        recipes.forEach(recipe => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");
            recipeCard.innerHTML = `
                <img src="${recipe.image_url}" alt="${recipe.title}" onerror="this.src='https://dummyimage.com/300x200/ddd/000.png&text=Recipe'">
                <div class="recipe-card-content">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description ? recipe.description.substring(0, 100) + '...' : 'No description available'}</p>
                </div>
            `;
            recipeCard.addEventListener("click", () => {
                window.location.href = `recipe.html?id=${recipe.id}`;
            });
            recipeGrid.appendChild(recipeCard);
        });

        updatePaginationControls(recipes.length, total);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        loadingElement.style.display = "none";
        recipeGrid.innerHTML = `<p class="error-message">An error occurred while loading recipes. Please try again.</p>`;
    }
}

function updatePaginationControls(currentItemsCount, total = totalRecipes) {
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    prevPageBtn.disabled = currentPage === 1;
    
    // For search results, we use the total from the search response if available
    const totalItems = total || totalRecipes;
    nextPageBtn.disabled = (currentPage * recipesPerPage) >= totalItems;

    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(totalItems / recipesPerPage)}`;
}

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.querySelector(".search-bar button");

    searchButton.addEventListener("click", (event) => {
        event.preventDefault();
        performSearch();
    });

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            performSearch();
        }
    });
}

function performSearch() {
    const query = document.getElementById("searchInput").value.trim();
    currentSearchQuery = query;
    
    if (query) {
        isSearchActive = true;
        currentPage = 1;
        updateRecipesDisplay();
    } else {
        isSearchActive = false;
        currentPage = 1;
        updateRecipesDisplay();
    }
}