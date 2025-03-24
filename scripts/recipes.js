//recipes.js
let currentPage = 1;
const recipesPerPage = 6;

document.addEventListener("DOMContentLoaded", function () {
    fetchRecipes(); // Fetch all recipes initially
    setupSearch(); // Set up search functionality
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
                    <a href="#">My Account ▼</a>
                    <ul class="dropdown-menu">
                        <li><a href="profile.html">My Profile</a></li>
                        <li><a href="favorites.html">Favorites</a></li>
                        <li><a href="#" id="logoutBtn">Logout</a></li>
                    </ul>
                </li>
            `;
        }

        if (role === "admin") {
            authLinks.innerHTML += `<li><a href="admin-dashboard.html">Admin Panel</a></li>`;
        }

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                alert("Logged out successfully.");
                window.location.href = "index.html";
            });
        }
    }

    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                fetchRecipes(currentPage);
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", () => {
            currentPage++;
            fetchRecipes(currentPage);
        });
    }
});

function fetchRecipes() {
    fetch(`https://chefnest.onrender.com/recipes`)
        .then(response => response.json())
        .then(data => {
            const recipeGrid = document.querySelector(".recipe-grid");
            if (!recipeGrid) {
                console.error("Recipe grid element not found");
                return;
            }
            
            recipeGrid.innerHTML = "";

            data.forEach(recipe => {
                const recipeCard = document.createElement("div");
                recipeCard.classList.add("recipe-card");
                recipeCard.innerHTML = `
                    <img src="${recipe.image_url}" alt="${recipe.title}" onerror="this.src='https://dummyimage.com/300x200/ddd/000.png&text=Recipe'">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description ? recipe.description.substring(0, 100) + '...' : 'No description available'}</p>
                `;
                recipeCard.addEventListener("click", () => {
                    window.location.href = `recipe.html?id=${recipe.id}`;
                });
                recipeGrid.appendChild(recipeCard);
            });
        })
        .catch(error => console.error("Error fetching recipes:", error));
}

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.querySelector(".search-bar button");

    searchButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevents the page from refreshing
        const query = searchInput.value.trim();
        if (query) {
            searchRecipes(query);
        } else {
            fetchRecipes(); // Fetch all recipes if search query is empty
        }
    });

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevents the page from refreshing
            const query = searchInput.value.trim();
            if (query) {
                searchRecipes(query);
            } else {
                fetchRecipes(); // Fetch all recipes if search query is empty
            }
        }
    });
}


function searchRecipes(query) {
    console.log("Searching for:", query);

    fetch(`https://chefnest.onrender.com/recipes/search?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const recipeGrid = document.querySelector(".recipe-grid");
            if (!recipeGrid) {
                console.error("Recipe grid element not found");
                return;
            }
            
            recipeGrid.innerHTML = "";

            if (data.length === 0) {
                recipeGrid.innerHTML = `<p class="no-results">No recipes found for "${query}".</p>`;
                return;
            }

            data.forEach(recipe => {
                const recipeCard = document.createElement("div");
                recipeCard.classList.add("recipe-card");
                recipeCard.innerHTML = `
                    <img src="${recipe.image_url}" alt="${recipe.title}" onerror="this.src='https://dummyimage.com/300x200/ddd/000.png&text=Recipe'">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description ? recipe.description.substring(0, 100) + '...' : 'No description available'}</p>
                `;
                recipeCard.addEventListener("click", () => {
                    window.location.href = `recipe.html?id=${recipe.id}`;
                });
                recipeGrid.appendChild(recipeCard);
            });
        })
        .catch(error => {
            console.error("Error searching recipes:", error);
            const recipeGrid = document.querySelector(".recipe-grid");
            if (recipeGrid) {
                recipeGrid.innerHTML = `<p class="error-message">An error occurred while searching. Please try again.</p>`;
            }
        });
}