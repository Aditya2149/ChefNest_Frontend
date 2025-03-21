let currentPage = 1;
const recipesPerPage = 6;

document.addEventListener("DOMContentLoaded", function () {
    fetchRecipes(currentPage);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const authLinks = document.getElementById("authLinks");

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

    document.getElementById("logoutBtn")?.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        alert("Logged out successfully.");
        window.location.href = "index.html";
    });

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
