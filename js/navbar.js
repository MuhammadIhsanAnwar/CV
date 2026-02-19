(function () {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) {
    return;
  }

  const path = window.location.pathname.replace(/\\/g, "/");
  const isInCv = path.includes("/cv/");
  const isInAdmin = path.includes("/admin/");
  const basePath = isInCv || isInAdmin ? "../" : "";
  const current = isInAdmin ? "admin" : isInCv ? "cv" : "home";

  const navHtml = `
    <navbar>
      <nav>
        <a href="${basePath}index.html" class="nav-brand">MIA</a>
        <ul class="nav-menu">
          <li><a href="${basePath}index.html" class="nav-link${current === "home" ? " active" : ""}">Home</a></li>
          <li><a href="${basePath}cv/cv.html" class="nav-link${current === "cv" ? " active" : ""}">CV</a></li>
          <li><a href="${basePath}admin/admin.html" class="nav-link${current === "admin" ? " active" : ""}">Admin</a></li>
        </ul>
        <div class="nav-actions">
          <button class="btn-dark-mode" id="darkModeToggle" title="Toggle Dark Mode">
            <i class="fas fa-moon"></i>
          </button>
          ${
            isInAdmin
              ? "<button class=\"btn-logout admin-logout\" id=\"logoutBtn\" onclick=\"logout()\"><i class=\"fas fa-sign-out-alt\"></i> Logout</button>"
              : ""
          }
        </div>
      </nav>
    </navbar>
  `;

  placeholder.innerHTML = navHtml.trim();
})();
