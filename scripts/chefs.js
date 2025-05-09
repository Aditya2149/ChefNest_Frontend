// chefs.js
document.addEventListener("DOMContentLoaded", () => {
    fetchChefs(); // Fetch and display chefs on page load

    const token = localStorage.getItem("token");
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
});

// Fetch all chefs from the backend
async function fetchChefs() {
    const loadingElement = document.querySelector(".loading");

    // Show loading indicator
    loadingElement.style.display = "flex";
    try {
        const response = await fetch("https://chefnest.onrender.com/chef-profile/all");
        const chefs = await response.json();

        if (response.ok) {
            loadingElement.style.display = "none";
            displayChefs(chefs);
        } else {
            console.error("Error fetching chefs:", chefs.message);
            document.getElementById("chefList").innerHTML = "<p>Failed to load chefs.</p>";
        }
    } catch (error) {
        console.error("Network error:", error);
        document.getElementById("chefList").innerHTML = "<p>Error loading chefs. Try again later.</p>";
    }
}

// Display chefs dynamically
function displayChefs(chefs) {
    const chefList = document.getElementById("chefList");
    chefList.innerHTML = ""; // Clear previous content

    if (chefs.length === 0) {
        chefList.innerHTML = "<p>No chefs found.</p>";
        return;
    }

    chefs.forEach(chef => {
        const chefCard = document.createElement("div");
        chefCard.classList.add("chef-card");

        // Use placeholder image if no profile picture is available
        const profileImage = chef.profile_picture || "default-chef.png";

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
        chefCard.addEventListener("click", () => {
            window.location.href = `chef.html?id=${chef.user_id}`;
        });

        chefList.appendChild(chefCard);
    });
}

// Search and Filter Chefs
function filterChefs() {
    const nameInput = document.getElementById("searchName").value.toLowerCase();
    const locationInput = document.getElementById("searchLocation").value.toLowerCase();

    fetch("https://chefnest.onrender.com/chef-profile/all")
        .then(response => response.json())
        .then(chefs => {
            const filteredChefs = chefs.filter(chef =>
                (chef.full_name && chef.full_name.toLowerCase().includes(nameInput)) &&
                (chef.location && chef.location.toLowerCase().includes(locationInput))
            );

            displayChefs(filteredChefs);
        })
        .catch(error => console.error("Error filtering chefs:", error));
}

function bookChef(chefId) {
    window.location.href = `booking.html?chefId=${chefId}`;
}
