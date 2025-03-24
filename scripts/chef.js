document.addEventListener("DOMContentLoaded", () => {
    fetchChefs(); // Fetch and display chefs on page load
});

// Fetch all chefs from the backend
async function fetchChefs() {
    try {
        const response = await fetch("https://chefnest.onrender.com/chef-profile/all");
        const chefs = await response.json();

        if (response.ok) {
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