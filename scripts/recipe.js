document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    try {
        // Fetch recipe details
        const recipeResponse = await fetch(`https://chefnest.onrender.com/recipes/${recipeId}`);
        const recipeData = await recipeResponse.json();
        const { recipe, ingredients, steps } = recipeData;
        const chefId = recipe.chef_id;

        // Fetch chef details using chefId
        const chefResponse = await fetch(`https://chefnest.onrender.com/chef-profile/${chefId}`);
        const chefData = await chefResponse.json();
        const chefName = chefData.profile.name;

        // Fetch reviews
        const reviewsResponse = await fetch(`https://chefnest.onrender.com/reviews/${recipeId}`);
        const reviewsData = await reviewsResponse.json();
        const reviews = reviewsData || [];

        const detailsSection = document.getElementById("recipe-details");

        detailsSection.innerHTML = `
            <div class="recipe-container">
                <h1>${recipe.title}</h1>
                <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe-img">
                <p>${recipe.description}</p>
                
                <h3>Posted by: <a href="chefprofile.html?id=${chefId}" class="chef-link">${chefName}</a></h3>

                <h3>Ingredients:</h3>
                <ul class="ingredients-list">
                    ${ingredients.map(ing => `<li>${ing.name} - ${ing.quantity}</li>`).join("")}
                </ul>

                <h3>Steps:</h3>
                <ol class="steps-list">
                    ${steps.map(step => `<li>${step.description}</li>`).join("")}
                </ol>

                <h3>Reviews:</h3>
                <ul class="reviews-list">
                    ${reviews.length > 0 
                        ? reviews.map(review => `<li><strong>${review.user_name}:</strong> ${review.comment} (⭐ ${review.rating})</li>`).join("") 
                        : "<li>No reviews yet.</li>"
                    }
                </ul>
            </div>
        `;
    } catch (error) {
        console.error("Error fetching recipe details:", error);
    }
});
