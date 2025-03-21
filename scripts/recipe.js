document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    // Fetch Recipe Details
    fetch(`https://chefnest.onrender.com/recipes/${recipeId}`)
        .then(response => response.json())
        .then(recipeData => {
            // Fetch Reviews separately
            return fetch(`https://chefnest.onrender.com/reviews/${recipeId}`)
                .then(response => response.json())
                .then(reviewsData => ({ recipe: recipeData.recipe, ingredients: recipeData.ingredients, steps: recipeData.steps, reviews: reviewsData }));
        })
        .then(({ recipe, ingredients, steps, reviews }) => {
            const detailsSection = document.getElementById("recipe-details");

            detailsSection.innerHTML = `
                <h1>${recipe.title}</h1>
                <img src="${recipe.image_url}" alt="${recipe.title}">
                <p>${recipe.description}</p>
                <h3>Chef ID: ${recipe.chef_id}</h3>

                <h3>Ingredients:</h3>
                <ul>
                    ${ingredients.map(ing => `<li>${ing.name} - ${ing.quantity}</li>`).join("")}
                </ul>

                <h3>Steps:</h3>
                <ol>
                    ${steps.map(step => `<li>${step.description}</li>`).join("")}
                </ol>

                <h3>Reviews:</h3>
                <ul>
                    ${reviews.length > 0 ? reviews.map(review => `<li><strong>${review.user_name}:</strong> ${review.comment} (⭐ ${review.rating})</li>`).join("") : "<li>No reviews yet.</li>"}
                </ul>
            `;
        })
        .catch(error => console.error("Error fetching recipe details:", error));
});
