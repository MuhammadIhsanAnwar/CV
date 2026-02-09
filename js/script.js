// API URL - Ubah sesuai domain cPanel Anda
const API_BASE_URL = 'https://neoverse.my.id/api';

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
  // Check if running on GitHub Pages (CORS will block API calls)
  const isGitHubPages = window.location.hostname.includes('githubusercontent.com') || 
                        window.location.hostname.includes('github.io');
  
  if (isGitHubPages) {
    console.log('[INFO] Running on GitHub Pages - API calls blocked by CORS policy');
    console.log('[INFO] Using default profile data and no projects');
    updatePage(); // Use default data
    return;
  }
  
  fetch(`${API_BASE_URL}/get-profile.php`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      return response.text().then(text => {
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('API returned non-JSON response:', text);
          throw new Error(`Server error: ${text.substring(0, 100)}`);
        }
      });
    })
    .then(data => {
      // Mapping data dari API
      profileData.name = data.name || profileData.name;
      profileData.job = data.job || profileData.job;
      profileData.email = data.email || profileData.email;
      profileData.phone = data.phone || profileData.phone;
      profileData.location = data.location || profileData.location;
      profileData.bio = data.bio || profileData.bio;
      profileData.about = data.about || profileData.about;
      
      // Parse array data
      profileData.education = Array.isArray(data.education) ? data.education : [];
      profileData.skills = Array.isArray(data.skills) ? data.skills : [];
      profileData.experience = Array.isArray(data.experience) ? data.experience : [];
      profileData.achievement = Array.isArray(data.achievement) ? data.achievement : [];
      
      console.log('[OK] Data loaded from API:', profileData);
      updatePage();
    })
    .catch(error => {
      console.error('[ERROR] Error loading data from API:', error.message);
      console.warn('[INFO] Check: Is API endpoint https://neoverse.my.id/api/get-profile.php working?');
      console.log('Using default data as fallback');
      updatePage();
    });
  
  // Load projects from API
  loadProjects();
}

// Load projects from API
function loadProjects() {
  // Check if running on GitHub Pages (CORS will block API calls)
  const isGitHubPages = window.location.hostname.includes('githubusercontent.com') || 
                        window.location.hostname.includes('github.io');
  
  if (isGitHubPages) {
    console.log('[INFO] Skipping project API call - running on GitHub Pages with CORS restriction');
    return;
  }
  
  fetch(`${API_BASE_URL}/get-projects.php`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      return response.text().then(text => {
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('API returned non-JSON response:', text);
          throw new Error(`Server error: ${text.substring(0, 100)}`);
        }
      });
    })
    .then(data => {
      if (data.success && data.data) {
        console.log('[OK] Projects loaded from API:', data.data.length, 'projects');
        renderProjects(data.data);
      }
    })
    .catch(error => {
      console.error('[ERROR] Error loading projects:', error.message);
      console.warn('[INFO] Check: Is API endpoint https://neoverse.my.id/api/get-projects.php working?');
    });
}

// Render projects dynamically
function renderProjects(projects) {
  const projectsGrid = document.getElementById('projectsGrid');
  
  if (!projectsGrid) return;
  
  if (!projects || projects.length === 0) {
    projectsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px;">Belum ada proyek</p>';
    return;
  }
  
  projectsGrid.innerHTML = projects.map(project => `
    <div class="project-card">
      <div class="project-image">
        ${project.foto_proyek 
          ? `<img src="https://neoverse.my.id/foto_proyek/${project.foto_proyek}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<div style=\\'width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center;\\'><i class=\\'fas fa-image\\' style=\\'font-size: 48px; color: white;\\'></i></div>';">` 
          : `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center;"><i class="fas fa-image" style="font-size: 48px; color: white;"></i></div>`}
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tech">
          ${project.tech_stack && project.tech_stack.length > 0 
            ? project.tech_stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')
            : ''}
        </div>
        <div class="project-buttons">
          ${project.demo_link ? `
            <a href="${project.demo_link}" class="btn-demo" target="_blank">
              <i class="fas fa-external-link-alt"></i> Live Demo
            </a>
          ` : ''}
          <a href="${project.github_link}" class="btn-github" target="_blank">
            <i class="fab fa-github"></i> Repository
          </a>
        </div>
      </div>
    </div>
  `).join('');
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
  // Skip CORS-blocked API calls from GitHub Pages
  // GitHub Pages (muhammadihsananwar.github.io) cannot access neoverse.my.id API
  // Use default photo filenames instead
  console.log('[INFO] Skipping CORS-blocked API call from GitHub Pages');
  console.log('[INFO] Using default photo filenames: fotoprofil.png, fotoprofil2.jpg, fotoprofil3.jpg');
}

// Initialize scroll animation setelah halaman dimuat
window.addEventListener("load", function() {
  initScrollAnimation();
  loadPhotos();
});
