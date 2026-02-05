// Data default
let profileData = {
  name: "Muhammad Ihsan Anwar",
  job: "Web Developer / UI Designer",
  email: "muhammadihsananwar3@gmail.com",
  phone: "085279788815",
  location: "Medan, Indonesia",
  bio: "Saya adalah seorang pengembang web yang tertarik pada UI modern, teknologi terkini, dan pengalaman pengguna yang luar biasa.",
  about: "Saya adalah seorang pengembang web yang tertarik pada UI futuristik, teknologi modern, dan pengalaman pengguna. Saya memiliki passion untuk menciptakan website yang tidak hanya berfungsi dengan baik tetapi juga menarik secara visual.",
  education: [
    "S1 Teknologi Informasi – Universitas Sumatera Utara (2025 - Sekarang)",
    "SMA Negeri Asahan (2022 - 2025)"
  ],
  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "UI/UX Design",
    "Git & GitHub",
    "Responsive Design"
  ],
  experience: [
    "Junior Web Developer – Contoh Perusahaan (2024 - Sekarang)",
    "Freelance UI Designer (2023 - 2024)"
  ],
  achievement: [
    "Pemenang Kompetisi Web Design (2024)",
    "Best UI/UX Developer Award (2023)"
  ]
};

// Load data dari localStorage
function loadData() {
  const savedData = localStorage.getItem('profileData');
  if (savedData) {
    profileData = JSON.parse(savedData);
  }
  updatePage();
}

// Update halaman dengan data
function updatePage() {
  // Update Hero Section
  if (document.getElementById('heroName')) {
    document.getElementById('heroName').textContent = profileData.name;
  }
  if (document.getElementById('heroJob')) {
    document.getElementById('heroJob').textContent = profileData.job;
  }
  if (document.getElementById('heroBio')) {
    document.getElementById('heroBio').textContent = profileData.bio;
  }

  // Update Home Page
  if (document.getElementById('aboutMe')) {
    document.getElementById('aboutMe').textContent = profileData.about;
  }
  if (document.getElementById('educationList')) {
    document.getElementById('educationList').innerHTML = profileData.education
      .map(item => `<li>${item}</li>`).join('');
  }
  if (document.getElementById('skillsList')) {
    document.getElementById('skillsList').innerHTML = profileData.skills
      .map(skill => `<span class="skill-tag">${skill}</span>`).join('');
  }
  if (document.getElementById('experienceList')) {
    document.getElementById('experienceList').innerHTML = profileData.experience
      .map(item => `<li>${item}</li>`).join('');
  }
  if (document.getElementById('achievementList')) {
    document.getElementById('achievementList').innerHTML = profileData.achievement
      .map(item => `<li>${item}</li>`).join('');
  }

  // Update CV Page
  if (document.getElementById('cvName')) {
    document.getElementById('cvName').textContent = profileData.name;
  }
  if (document.getElementById('cvJob')) {
    document.getElementById('cvJob').textContent = profileData.job;
  }
  if (document.getElementById('cvEmail')) {
    document.getElementById('cvEmail').textContent = profileData.email;
  }
  if (document.getElementById('cvPhone')) {
    document.getElementById('cvPhone').textContent = profileData.phone;
  }
  if (document.getElementById('cvLocation')) {
    document.getElementById('cvLocation').textContent = profileData.location;
  }
  if (document.getElementById('cvAbout')) {
    document.getElementById('cvAbout').textContent = profileData.about;
  }
  if (document.getElementById('cvEducation')) {
    document.getElementById('cvEducation').innerHTML = profileData.education
      .map(item => `<li>${item}</li>`).join('');
  }
  if (document.getElementById('cvSkills')) {
    document.getElementById('cvSkills').innerHTML = profileData.skills
      .map(skill => `<li>${skill}</li>`).join('');
  }
  if (document.getElementById('cvExperience')) {
    document.getElementById('cvExperience').innerHTML = profileData.experience
      .map(item => `<li>${item}</li>`).join('');
  }
  if (document.getElementById('cvAchievement')) {
    document.getElementById('cvAchievement').innerHTML = profileData.achievement
      .map(item => `<li>${item}</li>`).join('');
  }

  // Update navbar active link
  updateNavbar();
}

// Update navbar active link
function updateNavbar() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Load data saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadData);

// Intersection Observer untuk scroll animation
function initScrollAnimation() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visible');
        entry.target.classList.remove('scroll-hidden');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observasi semua section cards
  const cards = document.querySelectorAll('.section-card');
  cards.forEach(card => {
    card.classList.add('scroll-hidden');
    observer.observe(card);
  });
}

// Initialize scroll animation setelah halaman dimuat
window.addEventListener('load', initScrollAnimation);
