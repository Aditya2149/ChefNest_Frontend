const API_BASE_URL = "https://chefnest.onrender.com"; // Replace with your backend URL

document.addEventListener("DOMContentLoaded", function () {
    // Identify the correct form based on the current page
    const userForm = document.getElementById("signup-user-form");
    const chefForm = document.getElementById("signup-chef-form");

    const handleSignup = async (event, role) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (role === "admin") {
            alert("Admin signup is not allowed. Only superusers can create admins.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup Successful! Please log in.");
                window.location.href = "login.html";
            } else {
                alert("Signup Failed: " + data.message);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    // Attach event listeners to both forms
    if (userForm) {
        userForm.addEventListener("submit", (e) => handleSignup(e, "user"));
    }
    if (chefForm) {
        chefForm.addEventListener("submit", (e) => handleSignup(e, "chef"));
    }
});
