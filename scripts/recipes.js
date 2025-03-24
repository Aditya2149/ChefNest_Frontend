//recipes.js
let currentPage = 1;
const recipesPerPage = 15;
let currentSearchQuery = ""; // Store search input

document.addEventListener("DOMContentLoaded", function () {
    fetchRecipes(currentPage);

    // Attach search functionality to the button
    document.querySelector(".search-bar button").addEventListener("click", function () {
        handleSearch();
    });

    // Also trigger search on "Enter" key press
    document.getElementById("searchInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            handleSearch();
        }
    });
});

// Function to fetch recipes with pagination & search
function fetchRecipes(page = 1, searchQuery = "") {
    let url = `https://chefnest.onrender.com/recipes?page=${page}&limit=${recipesPerPage}`;
    if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const recipeGrid = document.querySelector(".recipe-grid");
            if (!recipeGrid) {
                console.error("Recipe grid element not found");
                return;
            }

            recipeGrid.innerHTML = "";

            if (data.recipes.length === 0) {
                recipeGrid.innerHTML = `<p class="no-recipes">No recipes found.</p>`;
            } else {
                data.recipes.forEach(recipe => {
                    const recipeCard = document.createElement("div");
                    recipeCard.classList.add("recipe-card");
                    recipeCard.innerHTML = `
                        <img src="${recipe.image_url}" alt="${recipe.title}" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                        <h3>${recipe.title}</h3>
                        <p>${recipe.description ? recipe.description.substring(0, 100) + '...' : 'No description available'}</p>
                    `;
                    recipeCard.addEventListener("click", () => {
                        window.location.href = `recipe.html?id=${recipe.id}`;
                    });
                    recipeGrid.appendChild(recipeCard);
                });
            }

            setupPagination(data.totalPages, data.currentPage, searchQuery);
        })
        .catch(error => console.error("Error fetching recipes:", error));
}

// Pagination setup
function setupPagination(totalPages, currentPage, searchQuery) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = ""; // Clear previous pagination

    // Previous Button
    const prevButton = document.createElement("button");
    prevButton.textContent = "❮ Prev";
    prevButton.classList.add("page-btn", "prev-btn");
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchRecipes(currentPage, searchQuery);
        }
    });
    paginationContainer.appendChild(prevButton);

    // Numbered Buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("page-btn");
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        pageButton.addEventListener("click", () => {
            currentPage = i;
            fetchRecipes(currentPage, searchQuery);
        });
        paginationContainer.appendChild(pageButton);
    }

    // Next Button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next ❯";
    nextButton.classList.add("page-btn", "next-btn");
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchRecipes(currentPage, searchQuery);
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Handle Search
function handleSearch() {
    currentSearchQuery = document.getElementById("searchInput").value.trim();
    currentPage = 1; // Reset to first page when searching
    fetchRecipes(currentPage, currentSearchQuery);
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