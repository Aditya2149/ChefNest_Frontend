document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const chefId = urlParams.get("id");
    const loadingElement = document.querySelector(".loading");
    const container = document.querySelector(".container");

    // Show loading indicator
    loadingElement.style.display = "flex";
    container.style.display = "none";

    if (!chefId) {
        document.getElementById("chefProfile").innerHTML = "<p>Invalid chef profile.</p>";
        loadingElement.style.display = "none";
        return;
    }

    try {
        // Run all fetch requests in parallel and wait for them to complete
        await Promise.all([
            fetchChefProfile(chefId),
            fetchChefRecipes(chefId),
            fetchChefReviews(chefId)
        ]);
    } catch (error) {
        console.error("Error loading chef data:", error);
    } finally {
        // Hide loading indicator after all API calls finish
        container.style.display = "block";
        loadingElement.style.display = "none";
    }

    document.getElementById("bookChefBtn").addEventListener("click", () => {
        window.location.href = `booking.html?chefId=${chefId}`;
    });
});

// Fetch Chef Profile
async function fetchChefProfile(chefId) {
    try {
        const response = await fetch(`https://chefnest.onrender.com/chef-profile/${chefId}`);
        const data = await response.json();

        if (response.ok) {
            displayChefProfile(data.profile); // Pass only the profile object
        } else {
            document.getElementById("chefProfile").innerHTML = "<p>Failed to load chef profile.</p>";
        }
    } catch (error) {
        console.error("Error fetching chef profile:", error);
    }
}

function displayChefProfile(profile) {
    document.getElementById("chefProfile").innerHTML = `
        <div class="chef-details">
            <img src="${profile.profile_picture || 'assets/default-chef.jpg'}" alt="${profile.name}" class="chef-img">
            <h2>${profile.name}</h2>
            <p><strong>Expertise:</strong> ${profile.expertise}</p>
            <p><strong>Experience:</strong> ${profile.experience}</p>
            <p><strong>Location:</strong> ${profile.location}</p>
        </div>
    `;
}

// Fetch Chef Recipes
async function fetchChefRecipes(chefId) {
    try {
        const response = await fetch(`https://chefnest.onrender.com/recipes?chefId=${chefId}`);
        const recipes = await response.json();

        if (response.ok) {
            displayChefRecipes(recipes);
        } else {
            document.getElementById("recipeList").innerHTML = "<p>Failed to load recipes.</p>";
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

function displayChefRecipes(recipes) {
    const recipeList = document.getElementById("recipeList");
    recipeList.innerHTML = "";

    if (recipes.length === 0) {
        recipeList.innerHTML = "<p>No recipes available.</p>";
        return;
    }

    const initialRecipes = recipes.slice(0, 4); // Show only 4 initially
    renderRecipes(initialRecipes);

    if (recipes.length > 4) {
        document.getElementById("viewAllRecipesBtn").classList.remove("hidden");
        document.getElementById("viewAllRecipesBtn").addEventListener("click", () => {
            renderRecipes(recipes);
            document.getElementById("viewAllRecipesBtn").classList.add("hidden");
        });
    }
}

function renderRecipes(recipes) {
    const recipeList = document.getElementById("recipeList");
    recipeList.innerHTML = ""; // Clear previous recipes

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        recipeCard.innerHTML = `
            <img src="${recipe.image_url || 'assets/default-recipe.jpg'}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p>${recipe.description}</p>
        `;

        // Add event listener for navigation
        recipeCard.addEventListener("click", () => {
            window.location.href = `recipe.html?id=${recipe.id}`;
        });

        recipeList.appendChild(recipeCard);
    });
}

// Fetch Chef Reviews
async function fetchChefReviews(chefId) {
    try {
        const response = await fetch(`https://chefnest.onrender.com/chef-profile/reviews/${chefId}`);
        const data = await response.json(); // Ensure JSON parsing

        if (response.ok) {
            displayChefReviews(data.reviews); // Extract the reviews array
        } else {
            console.error("Error fetching reviews:", data.message);
            document.getElementById("reviewList").innerHTML = "<p>Failed to load reviews.</p>";
        }
    } catch (error) {
        console.error("Network error:", error);
        document.getElementById("reviewList").innerHTML = "<p>Error loading reviews. Try again later.</p>";
    }
}

function displayChefReviews(reviews) {
    const reviewList = document.getElementById("reviewList");
    reviewList.innerHTML = ""; // Clear previous reviews

    if (!reviews || reviews.length === 0) {
        reviewList.innerHTML = "<p>No reviews yet.</p>";
        return;
    }

    reviews.forEach(review => {
        const reviewItem = document.createElement("div");
        reviewItem.classList.add("review-item");
        reviewItem.innerHTML = `
            <p><strong>${review.reviewer_name}</strong> ⭐ ${review.rating}/5</p>
            <p>${review.comment}</p>
            <p class="review-date">${new Date(review.created_at).toLocaleDateString()}</p>
        `;
        reviewList.appendChild(reviewItem);
    });
}
