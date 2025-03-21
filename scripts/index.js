//index.js
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Handle authentication links
    if (token) {
        document.getElementById("authLinks").innerHTML = `
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="#" id="logoutBtn">Logout</a></li>
        `;
    }

    if (role === "admin") {
        document.getElementById("authLinks").innerHTML += `
            <li><a href="admin-dashboard.html">Admin Panel</a></li>
        `;
    }

    document.getElementById("logoutBtn")?.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        alert("Logged out successfully.");
        window.location.href = "index.html";
    });

    // Fetch and display recipes
    fetchRecipes();

    // Fetch and display chefs
    fetchChefs();
});

// Fetch recipes from the backend and populate the featured recipes section
function fetchRecipes() {
    fetch("https://chefnest.onrender.com/recipes")
        .then(response => response.json())
        .then(data => {
            const recipeGrid = document.querySelector(".recipe-grid");
            recipeGrid.innerHTML = ""; // Clear previous content
            data.forEach(recipe => {
                const recipeCard = document.createElement("div");
                recipeCard.classList.add("recipe-card");
                recipeCard.innerHTML = `
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description.substring(0, 100)}...</p>
                `;
                recipeGrid.appendChild(recipeCard);
            });
        })
        .catch(error => console.error("Error fetching recipes:", error));
}

// Fetch chefs from the backend and populate the top chefs section
function fetchChefs() {
    fetch("https://chefnest.onrender.com/chefs")
        .then(response => response.json())
        .then(data => {
            const chefGrid = document.querySelector(".chef-grid");
            chefGrid.innerHTML = ""; // Clear previous content
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

// Handle chef booking (redirects to booking page)
function bookChef(chefId) {
    window.location.href = `booking.html?chefId=${chefId}`;
}
