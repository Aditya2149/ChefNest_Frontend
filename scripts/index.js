//index.js
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");

    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("show");
    });

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
        }

        if (role === "admin") {
            authLinks.innerHTML += `<li><a href="admin-dashboard.html">Admin Panel</a></li>`;
        }

        // Find the logout button and add an event listener
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

    // Only fetch recipes and chefs if we're on a page that has these elements
    // Check if we're on the homepage where these elements exist
    if (document.querySelector(".recipe-grid")) {
        fetchRecipes();
    }
    
    if (document.querySelector(".chef-grid")) {
        fetchChefs();
    }
});

function fetchRecipes() {
    const recipeGrid = document.querySelector(".recipe-grid");

    if (!recipeGrid) {
        // This should not happen now with our check above, but keeping as a safeguard
        console.error("Error: .recipe-grid element not found.");
        return;
    }

    fetch("https://chefnest.onrender.com/recipes/top-rated")
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
        // This should not happen now with our check above, but keeping as a safeguard
        console.error("Error: .chef-grid element not found.");
        return;
    }

    fetch("https://chefnest.onrender.com/chef-profile/top-rated")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Chef data received:", data); // Debug log to see the data structure
            
            chefGrid.innerHTML = "";
            
            if (data && data.length > 0) {
                data.forEach(chef => {
                    const chefCard = document.createElement("div");
                    chefCard.classList.add("chef-card");
                    chefCard.innerHTML = `
                        <img src="${chef.profile_picture}" alt="${chef.full_name}" onerror="this.src='assets/default-chef.jpg'">
                        <h3>${chef.full_name}</h3>
                        <div class="chef-info">
                            <p><strong>Rating:</strong> ${parseFloat(chef.average_rating).toFixed(1)}⭐</p>
                            <p><strong>Location:</strong> ${chef.location}</p>
                            <p><strong>Expertise:</strong> ${chef.expertise}</p>
                        </div>
                        <button class="book-btn" onclick="bookChef(${chef.id})">Book Chef</button>
                    `;
                    chefGrid.appendChild(chefCard);
                });
            } else {
                chefGrid.innerHTML = "<p>No top chefs available at the moment.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching chefs:", error);
            chefGrid.innerHTML = "<p>Unable to load chef data. Please try again later.</p>";
        });
}

function bookChef(chefId) {
    window.location.href = `booking.html?chefId=${chefId}`;
}

