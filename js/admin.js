// API URL - Harus sama dengan script.js
const API_BASE_URL = 'https://neoverse.my.id/api';

// PIN Password
const ADMIN_PIN = "10982345";
let isAuthenticated = false;

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
  window.location.href = '../index.html';
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
  // Fetch latest data dari API sebelum load form
  fetch(`${API_BASE_URL}/get-profile.php`)
    .then(response => response.json())
    .then(data => {
      // Update profileData dengan data terbaru dari API
      profileData.name = data.name || profileData.name;
      profileData.job = data.job || profileData.job;
      profileData.email = data.email || profileData.email;
      profileData.phone = data.phone || profileData.phone;
      profileData.location = data.location || profileData.location;
      profileData.bio = data.bio || profileData.bio;
      profileData.about = data.about || profileData.about;
      profileData.education = Array.isArray(data.education) ? data.education : [];
      profileData.skills = Array.isArray(data.skills) ? data.skills : [];
      profileData.experience = Array.isArray(data.experience) ? data.experience : [];
      profileData.achievement = Array.isArray(data.achievement) ? data.achievement : [];
      
      // Isi form dengan data
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
    })
    .catch(error => {
      console.error('Error loading form data:', error);
      // Fallback ke data lokal jika API error
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
    });
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
      Swal.fire(
        'Berhasil!',
        'Data Anda telah berhasil disimpan.',
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

  // POST ke API cPanel
  fetch(`${API_BASE_URL}/save-profile.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Tampilkan pesan sukses
      const successMsg = document.getElementById('successMessage');
      successMsg.classList.add('show');
      
      setTimeout(() => {
        successMsg.classList.remove('show');
      }, 3000);
      
      console.log('Data berhasil disimpan ke database:', profileData);
    } else {
      Swal.fire('Error', data.message || 'Gagal menyimpan data', 'error');
      console.error('Error:', data.message);
    }
  })
  .catch(error => {
    Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
    console.error('Error:', error);
  });
}

// Reset form ke data asli
function resetForm() {
  loadAdminForm();
}

// ============ PROJECTS MANAGEMENT ============

let currentProjectId = null;
let allProjects = [];

// Switch between tabs
function switchTab(tab) {
  // Show/hide sections
  document.getElementById('profilSection').style.display = tab === 'profil' ? 'block' : 'none';
  document.getElementById('proyekSection').style.display = tab === 'proyek' ? 'block' : 'none';
  
  // Update tab buttons
  document.getElementById('tabProfil').classList.toggle('active', tab === 'profil');
  document.getElementById('tabProyek').classList.toggle('active', tab === 'proyek');
  
  // Load projects if switching to projects tab
  if (tab === 'proyek') {
    loadProjects();
  }
}

// Load all projects from API
function loadProjects() {
  fetch(`${API_BASE_URL}/get-projects.php`)
    .then(response => response.json())
    .then(data => {
      if (data.success && data.data) {
        allProjects = data.data;
        renderProjectsTable();
      } else {
        Swal.fire('Error', 'Gagal mengambil data proyek', 'error');
      }
    })
    .catch(error => {
      console.error('Error loading projects:', error);
      Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
    });
}

// Render projects table
function renderProjectsTable() {
  const tbody = document.getElementById('projectsTableBody');
  
  if (allProjects.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Belum ada proyek. <a href="#" onclick="openProjectModal(); return false;" style="color: var(--primary);">Tambah proyek baru</a></td></tr>';
    return;
  }
  
  tbody.innerHTML = allProjects.map((project, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><i class="${project.icon}"></i></td>
      <td>${project.title}</td>
      <td>${project.description.substring(0, 30)}...</td>
      <td>${project.tech_stack && project.tech_stack.length > 0 ? project.tech_stack.join(', ').substring(0, 20) + '...' : '-'}</td>
      <td>${project.display_order}</td>
      <td>
        <div class="project-actions">
          <button class="btn-edit" onclick="openProjectModal(${project.id})"><i class="fas fa-edit"></i> Edit</button>
          <button class="btn-delete" onclick="deleteProjectWithConfirm(${project.id})"><i class="fas fa-trash"></i> Hapus</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Open project modal for add or edit
function openProjectModal(projectId = null) {
  currentProjectId = projectId;
  const modal = document.getElementById('projectModal');
  const overlay = document.getElementById('projectModalOverlay');
  const deleteBtn = document.getElementById('btnDeleteProject');
  
  // Reset form
  document.getElementById('projectForm').reset();
  document.getElementById('projectIcon').value = 'fas fa-code';
  document.getElementById('projectOrder').value = allProjects.length + 1;
  
  // Show/hide delete button
  deleteBtn.style.display = projectId ? 'inline-block' : 'none';
  
  // Update title
  document.getElementById('projectModalTitle').textContent = projectId ? 'Edit Proyek' : 'Tambah Proyek Baru';
  
  // Load project data if editing
  if (projectId) {
    const project = allProjects.find(p => p.id == projectId);
    if (project) {
      document.getElementById('projectIcon').value = project.icon;
      document.getElementById('projectTitle').value = project.title;
      document.getElementById('projectDescription').value = project.description;
      document.getElementById('projectTech').value = project.tech_stack ? project.tech_stack.join(', ') : '';
      document.getElementById('projectDemoLink').value = project.demo_link || '';
      document.getElementById('projectGithubLink').value = project.github_link || '';
      document.getElementById('projectOrder').value = project.display_order;
    }
  }
  
  // Show modal
  modal.classList.add('show');
  overlay.classList.add('show');
  document.getElementById('projectIcon').focus();
}

// Close project modal
function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  const overlay = document.getElementById('projectModalOverlay');
  
  modal.classList.remove('show');
  overlay.classList.remove('show');
  currentProjectId = null;
}

// Submit project form
document.addEventListener('DOMContentLoaded', function() {
  const projectForm = document.getElementById('projectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveProject();
    });
  }
});

// Save project (add or update)
function saveProject() {
  const projectData = {
    id: currentProjectId || null,
    icon: document.getElementById('projectIcon').value,
    title: document.getElementById('projectTitle').value,
    description: document.getElementById('projectDescription').value,
    tech_stack: document.getElementById('projectTech').value.split(',').map(t => t.trim()).filter(t => t),
    demo_link: document.getElementById('projectDemoLink').value,
    github_link: document.getElementById('projectGithubLink').value,
    display_order: parseInt(document.getElementById('projectOrder').value)
  };
  
  // Validate
  if (!projectData.title || !projectData.github_link) {
    Swal.fire('Error', 'Judul dan link repository harus diisi', 'error');
    return;
  }
  
  fetch(`${API_BASE_URL}/save-projects.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(projectData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      Swal.fire('Berhasil!', currentProjectId ? 'Proyek berhasil diperbarui' : 'Proyek berhasil ditambahkan', 'success');
      closeProjectModal();
      loadProjects();
    } else {
      Swal.fire('Error', data.error || 'Gagal menyimpan proyek', 'error');
    }
  })
  .catch(error => {
    console.error('Error saving project:', error);
    Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
  });
}

// Delete project with confirmation
function deleteProjectWithConfirm(projectId = null) {
  const id = projectId || currentProjectId;
  
  if (!id) {
    Swal.fire('Error', 'Project ID tidak ditemukan', 'error');
    return;
  }
  
  Swal.fire({
    title: 'Konfirmasi Penghapusan',
    text: 'Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#666',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteProject(id);
    }
  });
}

// Delete project
function deleteProject(projectId) {
  fetch(`${API_BASE_URL}/delete-projects.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: projectId })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      Swal.fire('Berhasil!', 'Proyek berhasil dihapus', 'success');
      closeProjectModal();
      loadProjects();
    } else {
      Swal.fire('Error', data.error || 'Gagal menghapus proyek', 'error');
    }
  })
  .catch(error => {
    console.error('Error deleting project:', error);
    Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
  });
}
// ===== PROJECT MANAGEMENT FUNCTIONS =====

let projects = [];
let currentEditingProjectId = null;

// Switch between tabs
function switchTab(tab) {
  // Update tab buttons
  document.getElementById('tabProfil').classList.remove('active');
  document.getElementById('tabProyek').classList.remove('active');
  
  if (tab === 'profil') {
    document.getElementById('tabProfil').classList.add('active');
    document.getElementById('profilSection').style.display = 'block';
    document.getElementById('proyekSection').style.display = 'none';
  } else {
    document.getElementById('tabProyek').classList.add('active');
    document.getElementById('profilSection').style.display = 'none';
    document.getElementById('proyekSection').style.display = 'block';
    loadProjects();
  }
}

// Load all projects from API
function loadProjects() {
  fetch(`${API_BASE_URL}/get-projects.php`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        projects = data.data;
        renderProjectsTable();
      } else {
        Swal.fire('Error', 'Gagal memuat data proyek', 'error');
      }
    })
    .catch(error => {
      console.error('Error loading projects:', error);
      Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
    });
}

// Render projects table
function renderProjectsTable() {
  const tbody = document.getElementById('projectsTableBody');
  
  if (projects.length === 0) {
    tbody.innerHTML = '<tr style="text-align: center;"><td colspan="7">Belum ada proyek. <strong onclick="openProjectModal()" style="color: var(--primary); cursor: pointer;">Tambah sekarang</strong></td></tr>';
    return;
  }
  
  tbody.innerHTML = projects.map((project, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><i class="${project.icon}" style="font-size: 18px; color: var(--primary);"></i></td>
      <td><strong>${project.title}</strong></td>
      <td>${project.description.substring(0, 50)}...</td>
      <td>${project.tech_stack.join(', ')}</td>
      <td>${project.display_order}</td>
      <td>
        <div class="project-actions">
          <button class="btn-edit" onclick="editProject(${project.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn-delete" onclick="deleteProject(${project.id})">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Open project modal for adding new project
function openProjectModal(projectId = null) {
  currentEditingProjectId = projectId;
  const modal = document.getElementById('projectModal');
  const overlay = document.getElementById('projectModalOverlay');
  const form = document.getElementById('projectForm');
  const deleteBtn = document.getElementById('btnDeleteProject');
  
  if (projectId) {
    // Edit mode
    const project = projects.find(p => p.id === projectId);
    if (project) {
      document.getElementById('projectModalTitle').textContent = 'Edit Proyek';
      document.getElementById('projectIcon').value = project.icon;
      document.getElementById('projectTitle').value = project.title;
      document.getElementById('projectDescription').value = project.description;
      document.getElementById('projectTech').value = project.tech_stack.join(', ');
      document.getElementById('projectDemoLink').value = project.demo_link || '';
      document.getElementById('projectGithubLink').value = project.github_link;
      document.getElementById('projectOrder').value = project.display_order;
      deleteBtn.style.display = 'inline-block';
    }
  } else {
    // Add mode
    document.getElementById('projectModalTitle').textContent = 'Tambah Proyek Baru';
    form.reset();
    deleteBtn.style.display = 'none';
  }
  
  modal.classList.add('show');
  overlay.classList.add('show');
}

// Close project modal
function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  const overlay = document.getElementById('projectModalOverlay');
  
  modal.classList.remove('show');
  overlay.classList.remove('show');
  currentEditingProjectId = null;
  document.getElementById('projectForm').reset();
}

// Handle project form submission
document.addEventListener('DOMContentLoaded', function() {
  const projectForm = document.getElementById('projectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveProject();
    });
  }
});

// Save project (insert or update)
function saveProject() {
  const projectData = {
    icon: document.getElementById('projectIcon').value.trim(),
    title: document.getElementById('projectTitle').value.trim(),
    description: document.getElementById('projectDescription').value.trim(),
    tech_stack: document.getElementById('projectTech').value
      .split(',').map(t => t.trim()).filter(t => t),
    demo_link: document.getElementById('projectDemoLink').value.trim() || null,
    github_link: document.getElementById('projectGithubLink').value.trim(),
    display_order: parseInt(document.getElementById('projectOrder').value)
  };

  // Validate required fields
  if (!projectData.icon || !projectData.title || !projectData.description || !projectData.github_link) {
    Swal.fire('Error', 'Harap isi semua field yang wajib', 'error');
    return;
  }

  if (currentEditingProjectId) {
    projectData.id = currentEditingProjectId;
  }

  fetch(`${API_BASE_URL}/save-projects.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(projectData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      Swal.fire('Berhasil', currentEditingProjectId ? 'Proyek berhasil diperbarui' : 'Proyek berhasil ditambahkan', 'success');
      closeProjectModal();
      loadProjects();
    } else {
      Swal.fire('Error', data.error || 'Gagal menyimpan proyek', 'error');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
  });
}

// Edit project
function editProject(projectId) {
  openProjectModal(projectId);
}

// Delete project
function deleteProject(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (project) {
    currentEditingProjectId = projectId;
    openProjectModal(projectId);
  }
}

// Delete project with confirmation
function deleteProjectWithConfirm() {
  const project = projects.find(p => p.id === currentEditingProjectId);
  
  Swal.fire({
    title: 'Hapus Proyek?',
    text: `Apakah Anda yakin ingin menghapus "${project ? project.title : 'proyek'}" ini?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#666',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${API_BASE_URL}/delete-projects.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: currentEditingProjectId })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          Swal.fire('Berhasil', 'Proyek berhasil dihapus', 'success');
          closeProjectModal();
          loadProjects();
        } else {
          Swal.fire('Error', data.error || 'Gagal menghapus proyek', 'error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
      });
    }
  });
}