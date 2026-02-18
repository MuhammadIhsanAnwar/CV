// API URL - Ubah sesuai domain cPanel Anda
const API_BASE_URL = "https://neoverse.my.id/api";

// Data default
let profileData = {
  name: "Nama Lengkap",
  job: "Pekerjaan",
  email: "Email",
  phone: "Nomor WA",
  location: "Lokasi",
  bio: "Bio Singkat",
  about: "Tentang Saya",

  education: ["Perguruan Tinggi", "SMA/MA"],
  skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
  experience: ["Pengalaman 1", "Pengalaman 2"],
  achievement: ["Prestasi 1", "Prestasi 2"],
};

// Load data dari API cPanel
function loadData() {
  fetch(`${API_BASE_URL}/get-profile.php`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }
      return response.text().then((text) => {
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("API returned non-JSON response:", text);
          throw new Error(`Server error: ${text.substring(0, 100)}`);
        }
      });
    })
    .then((data) => {
      // Mapping data dari API
      profileData.name = data.name || profileData.name;
      profileData.job = data.job || profileData.job;
      profileData.email = data.email || profileData.email;
      profileData.phone = data.phone || profileData.phone;
      profileData.location = data.location || profileData.location;
      profileData.bio = data.bio || profileData.bio;
      profileData.about = data.about || profileData.about;

      // Parse array data
      profileData.education = Array.isArray(data.education)
        ? data.education
        : [];
      profileData.skills = Array.isArray(data.skills) ? data.skills : [];
      profileData.experience = Array.isArray(data.experience)
        ? data.experience
        : [];
      profileData.achievement = Array.isArray(data.achievement)
        ? data.achievement
        : [];

      console.log("[OK] Data loaded from API:", profileData);
      updatePage();
    })
    .catch((error) => {
      console.error("[ERROR] Error loading data from API:", error.message);
      console.warn(
        "[INFO] Check: Is API endpoint https://neoverse.my.id/api/get-profile.php working?",
      );
      console.log("Using default data as fallback");
      updatePage();
    });

  // Load projects from API
  loadProjects();
}

// Load projects from API
function loadProjects() {
  fetch(`${API_BASE_URL}/get-projects.php`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }
      return response.text().then((text) => {
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("API returned non-JSON response:", text);
          throw new Error(`Server error: ${text.substring(0, 100)}`);
        }
      });
    })
    .then((data) => {
      if (data.success && data.data) {
        console.log(
          "[OK] Projects loaded from API:",
          data.data.length,
          "projects",
        );
        renderProjects(data.data);
      }
    })
    .catch((error) => {
      console.error("[ERROR] Error loading projects:", error.message);
      console.warn(
        "[INFO] Check: Is API endpoint https://neoverse.my.id/api/get-projects.php working?",
      );
    });
}

// Render projects dynamically
function renderProjects(projects) {
  const projectsGrid = document.getElementById("projectsGrid");

  if (!projectsGrid) return;

  if (!projects || projects.length === 0) {
    projectsGrid.innerHTML =
      '<p style="grid-column: 1 / -1; text-align: center; padding: 40px;">Belum ada proyek</p>';
    return;
  }

  projectsGrid.innerHTML = projects
    .map(
      (project) => `
    <div class="project-card">
      <div class="project-image">
        ${
          project.foto_proyek
            ? `<img src="https://neoverse.my.id/foto_proyek/${project.foto_proyek}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<div style=\\'width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center;\\'><i class=\\'fas fa-image\\' style=\\'font-size: 48px; color: white;\\'></i></div>';">`
            : `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center;"><i class="fas fa-image" style="font-size: 48px; color: white;"></i></div>`
        }
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tech">
          ${
            project.tech_stack && project.tech_stack.length > 0
              ? project.tech_stack
                  .map((tech) => `<span class="tech-tag">${tech}</span>`)
                  .join("")
              : ""
          }
        </div>
        <div class="project-buttons">
          ${
            project.demo_link
              ? `
            <a href="${project.demo_link}" class="btn-demo" target="_blank">
              <i class="fas fa-external-link-alt"></i> Live Demo
            </a>
          `
              : ""
          }
          <a href="${project.github_link}" class="btn-github" target="_blank">
            <i class="fab fa-github"></i> Repository
          </a>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

// Update halaman dengan data
function updatePage() {
  // Update Hero Section
  if (document.getElementById("heroName")) {
    document.getElementById("heroName").textContent = profileData.name;
  }
  if (document.getElementById("heroJob")) {
    document.getElementById("heroJob").textContent = profileData.job;
  }
  if (document.getElementById("heroBio")) {
    document.getElementById("heroBio").textContent = profileData.bio;
  }

  // Update Home Page
  if (document.getElementById("aboutMe")) {
    document.getElementById("aboutMe").textContent = profileData.about;
  }
  if (document.getElementById("educationList")) {
    document.getElementById("educationList").innerHTML = profileData.education
      .map((item) => `<li>${item}</li>`)
      .join("");
  }
  if (document.getElementById("skillsList")) {
    document.getElementById("skillsList").innerHTML = profileData.skills
      .map((skill) => `<span class="skill-tag">${skill}</span>`)
      .join("");
  }
  if (document.getElementById("experienceList")) {
    document.getElementById("experienceList").innerHTML = profileData.experience
      .map((item) => `<li>${item}</li>`)
      .join("");
  }
  if (document.getElementById("achievementList")) {
    document.getElementById("achievementList").innerHTML =
      profileData.achievement.map((item) => `<li>${item}</li>`).join("");
  }

  // Update CV Page
  if (document.getElementById("cvName")) {
    document.getElementById("cvName").textContent = profileData.name;
  }
  if (document.getElementById("cvJob")) {
    document.getElementById("cvJob").textContent = profileData.job;
  }
  if (document.getElementById("cvEmail")) {
    document.getElementById("cvEmail").textContent = profileData.email;
  }
  if (document.getElementById("cvPhone")) {
    document.getElementById("cvPhone").textContent = profileData.phone;
  }
  if (document.getElementById("cvLocation")) {
    document.getElementById("cvLocation").textContent = profileData.location;
  }
  if (document.getElementById("cvAbout")) {
    document.getElementById("cvAbout").textContent = profileData.about;
  }
  if (document.getElementById("cvEducation")) {
    document.getElementById("cvEducation").innerHTML = profileData.education
      .map((item) => `<li>${item}</li>`)
      .join("");
  }
  if (document.getElementById("cvSkills")) {
    document.getElementById("cvSkills").innerHTML = profileData.skills
      .map((skill) => `<li>${skill}</li>`)
      .join("");
  }
  if (document.getElementById("cvExperience")) {
    document.getElementById("cvExperience").innerHTML = profileData.experience
      .map((item) => `<li>${item}</li>`)
      .join("");
  }
  if (document.getElementById("cvAchievement")) {
    document.getElementById("cvAchievement").innerHTML = profileData.achievement
      .map((item) => `<li>${item}</li>`)
      .join("");
  }

  // Update navbar active link
  updateNavbar();
}

// Update navbar active link
function updateNavbar() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href").split("/").pop();
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

// Load data saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadData);

// Intersection Observer untuk scroll animation
function initScrollAnimation() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("scroll-visible");
        entry.target.classList.remove("scroll-hidden");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observasi semua section cards
  const cards = document.querySelectorAll(".section-card");
  cards.forEach((card) => {
    card.classList.add("scroll-hidden");
    observer.observe(card);
  });
}

// Load photos dari database
function loadPhotos() {
  fetch(`${API_BASE_URL}/upload-photos.php`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      return response.text().then((text) => {
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("[ERROR] Invalid JSON from photo API:", text);
          throw new Error(`Server error: ${text.substring(0, 100)}`);
        }
      });
    })
    .then((data) => {
      if (data.success && data.data) {
        console.log("[OK] Photos loaded from database:", data.data);

        // Update foto 1 (hero-avatar)
        if (data.data.foto1) {
          const heroImg = document.querySelector(".hero-avatar");
          if (heroImg) {
            heroImg.src = "foto/" + data.data.foto1;
          }
        }

        // Update foto 2 (profile-photo)
        if (data.data.foto2) {
          const profileImg = document.querySelector(".profile-photo");
          if (profileImg) {
            profileImg.src = "foto/" + data.data.foto2;
          }
        }

        // Update foto 3 (contact-photo-img)
        if (data.data.foto3) {
          const contactImg = document.querySelector(".contact-photo-img");
          if (contactImg) {
            contactImg.src = "foto/" + data.data.foto3;
          }
        }
      } else {
        console.log(
          "[INFO] No custom photos in database, using default filenames",
        );
      }
    })
    .catch((error) => {
      console.warn("[WARN] Could not load custom photos:", error.message);
      console.log("[INFO] Using default photo filenames");
    });
}

// Social media configuration
const socialMediaConfig = {
  whatsapp: { icon: "fab fa-whatsapp", prefix: "https://wa.me/" },
  linkedin: { icon: "fab fa-linkedin", prefix: "https://linkedin.com/in/" },
  github: { icon: "fab fa-github", prefix: "https://github.com/" },
  twitter: { icon: "fab fa-twitter", prefix: "https://twitter.com/" },
  instagram: { icon: "fab fa-instagram", prefix: "https://instagram.com/" },
  facebook: { icon: "fab fa-facebook", prefix: "https://facebook.com/" },
  tiktok: { icon: "fab fa-tiktok", prefix: "https://tiktok.com/@" },
  youtube: { icon: "fab fa-youtube", prefix: "https://youtube.com/" },
};

// Load kontak data dari API
function loadKontakData() {
  fetch(`${API_BASE_URL}/get-kontak.php`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log("[OK] Kontak data loaded:", data);

      // Update Email
      if (data.email) {
        const emailLink = document.getElementById("contactEmail");
        if (emailLink) {
          emailLink.href = `mailto:${data.email}`;
          emailLink.textContent = data.email;
        }
      }

      // Update Phone
      if (data.phone) {
        const phoneLink = document.getElementById("contactPhone");
        if (phoneLink) {
          const phoneNumber = data.phone.replace(/\D/g, "");
          phoneLink.href = `tel:+${phoneNumber}`;
          phoneLink.textContent = data.phone;
        }
      }

      // Update Location
      if (data.alamat && data.kota) {
        const locationLink = document.getElementById("contactLocation");
        if (locationLink) {
          const locationText = `${data.alamat}, ${data.kota}`;
          locationLink.href = `https://www.google.com/maps/search/${encodeURIComponent(locationText)}`;
          locationLink.textContent = locationText;
        }
      } else if (data.kota) {
        const locationLink = document.getElementById("contactLocation");
        if (locationLink) {
          locationLink.href = `https://www.google.com/maps/search/${encodeURIComponent(data.kota)}`;
          locationLink.textContent = data.kota;
        }
      }

      // Populate social media links
      populateSocialMedia(data);
    })
    .catch((error) => {
      console.error("[ERROR] Error loading kontak data:", error.message);
      console.warn(
        "[INFO] Check: Is API endpoint https://neoverse.my.id/api/get-kontak.php working?",
      );
    });
}

// Populate social media links dynamically
function populateSocialMedia(data) {
  const socialContainer = document.getElementById("socialMediaContainer");
  if (!socialContainer) return;

  socialContainer.innerHTML = "";

  for (const [key, config] of Object.entries(socialMediaConfig)) {
    const value = data[key];
    if (value && value.trim()) {
      let url = value;

      // Handle bare usernames (add prefix if not full URL)
      if (!value.startsWith("http://") && !value.startsWith("https://")) {
        url = config.prefix + value;
      }

      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.className = "social-btn";
      link.title = key.charAt(0).toUpperCase() + key.slice(1);
      link.innerHTML = `<i class="${config.icon}"></i>`;

      socialContainer.appendChild(link);
    }
  }
}

// Initialize scroll animation setelah halaman dimuat
window.addEventListener("load", function () {
  initScrollAnimation();
  loadPhotos();
  loadKontakData();
});

// Auto-update tahun di footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
