document.addEventListener("DOMContentLoaded", function () {
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

        document.getElementById("logoutBtn")?.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            alert("Logged out successfully.");
            window.location.href = "index.html";
        });
    }

    fetchRecipes();
    fetchChefs();
});

function fetchRecipes() {
    const recipeGrid = document.querySelector(".recipe-grid");

    if (!recipeGrid) {
        console.error("Error: .recipe-grid element not found.");
        return;
    }

    fetch("https://chefnest.onrender.com/recipes")
        .then(response => response.json())
        .then(data => {
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
                    window.location.href = `recipe.html?id=${recipe.id}`;
                });
                recipeGrid.appendChild(recipeCard);
            });
        })
        .catch(error => console.error("Error fetching recipes:", error));
}

function fetchChefs() {
    const chefGrid = document.querySelector(".chef-grid");

    if (!chefGrid) {
        console.error("Error: .chef-grid element not found.");
        return;
    }

    fetch("https://chefnest.onrender.com/chef-profile/top-rated")
        .then(response => response.json())
        .then(data => {
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