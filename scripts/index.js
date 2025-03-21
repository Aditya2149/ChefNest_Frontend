document.addEventListener("DOMContentLoaded", function () {
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

    fetchRecipes();
    fetchChefs();
});

function fetchRecipes() {
    fetch("https://chefnest.onrender.com/recipes")
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
        .catch(error => console.error("Error fetching recipes:", error));
}

function fetchChefs() {
    fetch("https://chefnest.onrender.com/chefs")
        .then(response => response.json())
        .then(data => {
            const chefGrid = document.querySelector(".chef-grid");
            chefGrid.innerHTML = "";
            data.forEach(chef => {
                const chefCard = document.createElement("div");
                chefCard.classList.add("chef-card");
                chefCard.innerHTML = `
                    <img src="${chef.image_url}" alt="${chef.name}">
                    <h3>${chef.name}</h3>
                    <p>${chef.specialty}</p>
                    <button class="book-btn" onclick="bookChef(${chef.id})">Book Chef</button>
                `;
                chefGrid.appendChild(chefCard);
            });
        })
        .catch(error => console.error("Error fetching chefs:", error));
}

function bookChef(chefId) {
    window.location.href = `booking.html?chefId=${chefId}`;
}

// Search functionality
function searchRecipes() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    fetch("https://chefnest.onrender.com/recipes")
        .then(response => response.json())
        .then(data => {
            const filteredRecipes = data.filter(recipe => recipe.title.toLowerCase().includes(searchInput));
            const recipeGrid = document.querySelector(".recipe-grid");
            recipeGrid.innerHTML = "";
            filteredRecipes.forEach(recipe => {
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
