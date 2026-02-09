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

// Load data dari localStorage
function loadData() {
  const savedData = localStorage.getItem("profileData");
  if (savedData) {
    profileData = JSON.parse(savedData);
  }
  updatePage();
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

// Initialize scroll animation setelah halaman dimuat
window.addEventListener("load", initScrollAnimation);
