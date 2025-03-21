let currentPage = 1;
const recipesPerPage = 6;

document.addEventListener("DOMContentLoaded", function () {
    fetchRecipes(currentPage);

    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchRecipes(currentPage);
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        currentPage++;
        fetchRecipes(currentPage);
    });
});

function fetchRecipes(page) {
    fetch(`https://chefnest.onrender.com/recipes?page=${page}&limit=${recipesPerPage}`)
        .then(response => response.json())
        .then(data => {
            const recipeGrid = document.querySelector(".recipe-grid");
            recipeGrid.innerHTML = "";

            if (data.length === 0) {
                document.getElementById("nextPage").disabled = true;
                return;
            } else {
                document.getElementById("nextPage").disabled = false;
            }

            data.forEach(recipe => {
                const recipeCard = document.createElement("div");
                recipeCard.classList.add("recipe-card");
                recipeCard.innerHTML = `
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description.substring(0, 100)}...</p>
                `;
                recipeCard.addEventListener("click", () => {
                    window.location.href = `recipe-details.html?id=${recipe.id}`;
                });
                recipeGrid.appendChild(recipeCard);
            });

            document.getElementById("pageNumber").textContent = `Page ${page}`;
        })
        .catch(error => console.error("Error fetching recipes:", error));
}

function searchRecipes() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    fetch(`https://chefnest.onrender.com/recipes?query=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            const recipeGrid = document.querySelector(".recipe-grid");
            recipeGrid.innerHTML = "";

            data.forEach(recipe => {
                const recipeCard = document.createElement("div");
                recipeCard.classList.add("recipe-card");
                recipeCard.innerHTML = `
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description.substring(0, 100)}...</p>
                `;
                recipeCard.addEventListener("click", () => {
                    window.location.href = `recipe-details.html?id=${recipe.id}`;
                });
                recipeGrid.appendChild(recipeCard);
            });
        })
        .catch(error => console.error("Error searching recipes:", error));
}
