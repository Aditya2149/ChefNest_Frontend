document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    fetch(`https://chefnest.onrender.com/recipes/${recipeId}`)
        .then(response => response.json())
        .then(recipe => {
            const detailsSection = document.getElementById("recipe-details");
            detailsSection.innerHTML = `
                <h1>${recipe.title}</h1>
                <img src="${recipe.image_url}" alt="${recipe.title}">
                <p>${recipe.description}</p>
                <h3>Chef: ${recipe.chef_name}</h3>
                <h3>Reviews:</h3>
                <ul>
                    ${recipe.reviews.map(review => `<li>${review.user}: ${review.comment}</li>`).join("")}
                </ul>
            `;
        })
        .catch(error => console.error("Error fetching recipe details:", error));
});
