document.addEventListener("DOMContentLoaded", function () {
    fetchRecipes(); // Fetch all recipes initially
    setupSearch(); // Set up search functionality
});

function fetchRecipes() {
    fetch(`https://chefnest.onrender.com/recipes`)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data);
        })
        .catch(error => console.error("Error fetching recipes:", error));
}

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.querySelector(".search-bar button");

    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
            searchRecipes(query);
        } else {
            fetchRecipes(); // Fetch all recipes if search query is empty
        }
    });

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
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
    fetch(`https://chefnest.onrender.com/recipes?query=${query}`)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data);
        })
        .catch(error => console.error("Error searching recipes:", error));
}

function displayRecipes(recipes) {
    const recipeGrid = document.querySelector(".recipe-grid");
    recipeGrid.innerHTML = "";

    if (recipes.length === 0) {
        recipeGrid.innerHTML = `<p class="no-results">No recipes found.</p>`;
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <img src="${recipe.image_url}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p>${recipe.description.substring(0, 100)}...</p>
        `;
        recipeCard.addEventListener("click", () => {
            window.location.href = `recipe.html?id=${recipe.id}`;
        });
        recipeGrid.appendChild(recipeCard);
    });
}