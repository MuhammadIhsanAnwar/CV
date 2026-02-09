// PIN Password
const ADMIN_PIN = "10982345";
let isAuthenticated = false;

// GitHub Config
const GITHUB_TOKEN = "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";
const GITHUB_OWNER = "MuhammadIhsanAnwar";
const GITHUB_REPO = "CV";
const GITHUB_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`;

// Verify password
function verifyPassword() {
  const passwordInput = document.getElementById('passwordInput');
  const passwordError = document.getElementById('passwordError');
  
  if (passwordInput.value === ADMIN_PIN) {
    isAuthenticated = true;
    sessionStorage.setItem('adminAuthenticated', 'true');
    document.getElementById('passwordModal').classList.remove('show');
    document.getElementById('blurOverlay').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    loadAdminForm();
  } else {
    passwordInput.value = '';
    passwordError.classList.add('show');
    setTimeout(() => {
      passwordError.classList.remove('show');
    }, 3000);
  }
}

// Logout function
function logout() {
  sessionStorage.removeItem('adminAuthenticated');
  isAuthenticated = false;
  document.getElementById('passwordModal').classList.add('show');
  document.getElementById('blurOverlay').style.display = 'block';
  document.getElementById('passwordInput').value = '';
  document.getElementById('logoutBtn').style.display = 'none';
  document.getElementById('passwordInput').focus();
}

// Go back to home
function goBack() {
  window.location.href = '../index.html';
}

// Handle Enter key on password input
document.addEventListener('DOMContentLoaded', function() {
  const passwordInput = document.getElementById('passwordInput');
  if (passwordInput) {
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        verifyPassword();
      }
    });
    passwordInput.focus();
  }

  // Check if already authenticated
  if (sessionStorage.getItem('adminAuthenticated') === 'true') {
    isAuthenticated = true;
    document.getElementById('passwordModal').classList.remove('show');
    document.getElementById('blurOverlay').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    setTimeout(loadAdminForm, 100);
  } else {
    document.getElementById('blurOverlay').style.display = 'block';
  }
});

// Load admin form dengan data yang ada
function loadAdminForm() {
  document.getElementById('adminName').value = profileData.name;
  document.getElementById('adminJob').value = profileData.job;
  document.getElementById('adminEmail').value = profileData.email;
  document.getElementById('adminPhone').value = profileData.phone;
  document.getElementById('adminLocation').value = profileData.location;
  document.getElementById('adminBio').value = profileData.bio;
  document.getElementById('adminAbout').value = profileData.about;
  document.getElementById('adminEducation').value = profileData.education.join(', ');
  document.getElementById('adminSkills').value = profileData.skills.join(', ');
  document.getElementById('adminExperience').value = profileData.experience.join(', ');
  document.getElementById('adminAchievement').value = profileData.achievement.join(', ');
}

// Simpan data dengan SweetAlert2 confirmation
function saveDataWithConfirm() {
  Swal.fire({
    title: 'Konfirmasi Penyimpanan',
    text: 'Apakah Anda yakin ingin menyimpan perubahan data ini?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0066cc',
    cancelButtonColor: '#666',
    confirmButtonText: 'Ya, Simpan',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      saveData();
      updateGitHub();
      Swal.fire(
        'Berhasil!',
        'Data Anda telah berhasil disimpan di GitHub.',
        'success'
      );
    }
  });
}

// Simpan data
function saveData() {
  profileData.name = document.getElementById('adminName').value;
  profileData.job = document.getElementById('adminJob').value;
  profileData.email = document.getElementById('adminEmail').value;
  profileData.phone = document.getElementById('adminPhone').value;
  profileData.location = document.getElementById('adminLocation').value;
  profileData.bio = document.getElementById('adminBio').value;
  profileData.about = document.getElementById('adminAbout').value;
  profileData.education = document.getElementById('adminEducation').value
    .split(',').map(item => item.trim()).filter(item => item);
  profileData.skills = document.getElementById('adminSkills').value
    .split(',').map(item => item.trim()).filter(item => item);
  profileData.experience = document.getElementById('adminExperience').value
    .split(',').map(item => item.trim()).filter(item => item);
  profileData.achievement = document.getElementById('adminAchievement').value
    .split(',').map(item => item.trim()).filter(item => item);

  // Simpan ke localStorage
  localStorage.setItem('profileData', JSON.stringify(profileData));

  // Tampilkan pesan sukses
  const successMsg = document.getElementById('successMessage');
  successMsg.classList.add('show');
  
  setTimeout(() => {
    successMsg.classList.remove('show');
  }, 3000);

  console.log('Data disimpan:', profileData);
}

// Update GitHub dengan data terbaru
async function updateGitHub() {
  try {
    const filePath = "1. Pemrograman Web Lanjutan/1. CV/js/script.js";
    const updatedScript = generateUpdatedScript();
    
    // Get file info
    const getResponse = await fetch(`${GITHUB_API}/${filePath}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!getResponse.ok) {
      console.error('Failed to get file from GitHub');
      return;
    }

    const fileData = await getResponse.json();
    
    // Update file
    const updateResponse = await fetch(`${GITHUB_API}/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `Update profile data - ${new Date().toLocaleString('id-ID')}`,
        content: btoa(updatedScript),
        sha: fileData.sha
      })
    });

    if (updateResponse.ok) {
      console.log('GitHub updated successfully');
    } else {
      console.error('Failed to update GitHub');
    }
  } catch (error) {
    console.error('Error updating GitHub:', error);
  }
}

// Generate updated script.js content dengan data terbaru
function generateUpdatedScript() {
  return `// Data default
let profileData = ${JSON.stringify(profileData, null, 2)};

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
      .map(item => \`<li>\${item}</li>\`).join('');
  }
  if (document.getElementById('skillsList')) {
    document.getElementById('skillsList').innerHTML = profileData.skills
      .map(skill => \`<span class="skill-tag">\${skill}</span>\`).join('');
  }
  if (document.getElementById('experienceList')) {
    document.getElementById('experienceList').innerHTML = profileData.experience
      .map(item => \`<li>\${item}</li>\`).join('');
  }
  if (document.getElementById('achievementList')) {
    document.getElementById('achievementList').innerHTML = profileData.achievement
      .map(item => \`<li>\${item}</li>\`).join('');
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
      .map(item => \`<li>\${item}</li>\`).join('');
  }
  if (document.getElementById('cvSkills')) {
    document.getElementById('cvSkills').innerHTML = profileData.skills
      .map(skill => \`<li>\${skill}</li>\`).join('');
  }
  if (document.getElementById('cvExperience')) {
    document.getElementById('cvExperience').innerHTML = profileData.experience
      .map(item => \`<li>\${item}</li>\`).join('');
  }
  if (document.getElementById('cvAchievement')) {
    document.getElementById('cvAchievement').innerHTML = profileData.achievement
      .map(item => \`<li>\${item}</li>\`).join('');
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
`;
}

// Reset form ke data asli
function resetForm() {
  loadAdminForm();
}
