document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
        document.getElementById("authLinks").innerHTML = `
            <li><a href="../index.html">Dashboard</a></li>
            <li><a href="#" id="logoutBtn">Logout</a></li>
        `;
    }

    if (role === "admin") {
        document.getElementById("authLinks").innerHTML += `
            <li><a href="admin-dashboard.html">Admin Panel</a></li>
        `;
    }

    document.getElementById("logoutBtn")?.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        alert("Logged out successfully.");
        window.location.href = "index.html";
    });
});
