const API_BASE_URL = "https://chefnest.onrender.com";  // Update with your backend URL

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const role = document.getElementById("role").value; // User, Chef, or Admin

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, role }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("role", role);

                    if (role === "admin") {
                        alert("Admin Login Successful!");
                        window.location.href = "admin-dashboard.html";
                    } else if (role === "chef") {
                        alert("Chef Login Successful!");
                        window.location.href = "chef-dashboard.html";
                    } else {
                        alert("User Login Successful!");
                        window.location.href = "dashboard.html";
                    }
                } else {
                    alert("Login Failed: " + data.message);
                }
            } catch (error) {
                console.error("Login Error:", error);
                alert("An error occurred. Please try again.");
            }
        });
    }
});
