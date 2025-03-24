//recipes.js
let currentPage = 1;
const recipesPerPage = 15;

document.addEventListener("DOMContentLoaded", function () {
    fetchRecipes(currentPage);
    setupSearch();
    setupPagination();
});

function fetchRecipes(page = 1) {
    fetch(`https://chefnest.onrender.com/recipes?page=${page}&limit=${recipesPerPage}`)
        .then(response => response.json())
        .then(data => {
            const recipeGrid = document.querySelector(".recipe-grid");
            if (!recipeGrid) {
                console.error("Recipe grid element not found");
                return;
            }

            recipeGrid.innerHTML = "";

            data.recipes.forEach(recipe => {
                const recipeCard = document.createElement("div");
                recipeCard.classList.add("recipe-card");
                recipeCard.innerHTML = `
                    <img src="${recipe.image_url}" alt="${recipe.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Recipe'">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description ? recipe.description.substring(0, 100) + '...' : 'No description available'}</p>
                `;
                recipeCard.addEventListener("click", () => {
                    window.location.href = `recipe.html?id=${recipe.id}`;
                });
                recipeGrid.appendChild(recipeCard);
            });

            setupPagination(data.totalPages, data.currentPage);
        })
        .catch(error => console.error("Error fetching recipes:", error));
}

function setupPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = ""; // Clear previous pagination

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("page-btn");
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        pageButton.addEventListener("click", () => {
            currentPage = i;
            fetchRecipes(currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }
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