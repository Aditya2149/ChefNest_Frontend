const API_BASE_URL = "https://chefnest.onrender.com"; // Replace with your backend URL

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const role = document.getElementById("role").value; // User or Chef (Admin signup disabled)

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
        });
    }
});
