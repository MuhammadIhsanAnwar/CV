// PIN Password
const ADMIN_PIN = "10982345";
let isAuthenticated = false;

// Projects data
let projects = [];
let currentEditingProjectId = null;

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
    setTimeout(function() {
      loadAdminForm();
      loadProjects();  // Load projects data too
    }, 100);
  } else {
    document.getElementById('blurOverlay').style.display = 'block';
  }
});

// Load admin form dengan data yang ada
function loadAdminForm() {
  // Fetch latest data dari API sebelum load form
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
      console.log('[OK] Admin form loaded from API');
    })
    .catch(error => {
      console.error('[ERROR] Error loading form data:', error.message);
      console.warn('Check: Is API endpoint https://neoverse.my.id/api/get-profile.php working?');
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
      console.log('Using default data as fallback');
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
  .then(response => {
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return response.text().then(text => {
      try {
        return JSON.parse(text);
      } catch (e) {
        throw new Error(`Server error: ${text.substring(0, 100)}`);
      }
    });
  })
  .then(data => {
    if (data.success) {
      // Tampilkan pesan sukses
      const successMsg = document.getElementById('successMessage');
      successMsg.classList.add('show');
      
      setTimeout(() => {
        successMsg.classList.remove('show');
      }, 3000);
      
      console.log('[OK] Data berhasil disimpan ke database:', profileData);
    } else {
      console.warn('[WARN] Save data failed:', data.message);
      Swal.fire('Error', data.message || 'Gagal menyimpan data', 'error');
    }
  })
  .catch(error => {
    console.error('[ERROR] Error saving profile:', error.message);
    console.warn('Check: Is API endpoint https://neoverse.my.id/api/save-profile.php working?');
    Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
  });
}

// Reset form ke data asli
function resetForm() {
  loadAdminForm();
}

// ===== PROJECT MANAGEMENT FUNCTIONS =====

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
      if (data.success) {
        projects = data.data;
        console.log('[OK] Projects loaded from API:', projects.length, 'projects');
        console.log('[DATA] Projects data:', projects);
        renderProjectsTable();
      } else {
        console.warn('[WARN] API returned error:', data);
        Swal.fire('Error', 'Gagal memuat data proyek', 'error');
      }
    })
    .catch(error => {
      console.error('[ERROR] Error loading projects:', error.message);
      console.warn('Check: Is API endpoint https://neoverse.my.id/api/get-projects.php working?');
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
  
  console.log('[INFO] Opening modal for project ID:', projectId);
  console.log('[DATA] Current projects array:', projects);
  
  if (projectId) {
    // Edit mode - find project by comparing as strings to avoid type mismatch
    const project = projects.find(p => String(p.id) === String(projectId));
    console.log(`[SEARCH] Searching for project: ${projectId}, Found:`, project);
    
    if (project) {
      document.getElementById('projectModalTitle').textContent = 'Edit Proyek';
      document.getElementById('projectIcon').value = project.icon || 'fas fa-code';
      document.getElementById('projectTitle').value = project.title || '';
      document.getElementById('projectDescription').value = project.description || '';
      document.getElementById('projectTech').value = Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : '';
      document.getElementById('projectDemoLink').value = project.demo_link || '';
      document.getElementById('projectGithubLink').value = project.github_link || '';
      document.getElementById('projectOrder').value = project.display_order || 1;
      deleteBtn.style.display = 'inline-block';
      console.log('[OK] Project data loaded:', project);
    } else {
      // Project not found in array
      console.warn('[WARN] Project ID ' + projectId + ' not found in projects array');
      Swal.fire('Peringatan', 'Data proyek tidak ditemukan. Mungkin belum terupdate dari server.', 'warning');
      // Still open modal but empty, so user can see error
      deleteBtn.style.display = 'none';
    }
  } else {
    // Add mode
    document.getElementById('projectModalTitle').textContent = 'Tambah Proyek Baru';
    document.getElementById('projectIcon').value = 'fas fa-code';
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('projectTech').value = '';
    document.getElementById('projectDemoLink').value = '';
    document.getElementById('projectGithubLink').value = '';
    document.getElementById('projectOrder').value = projects.length + 1 || 1;
    deleteBtn.style.display = 'none';
  }
  
  modal.classList.add('show');
  overlay.classList.add('show');
  
  // Focus on first input field
  setTimeout(() => {
    document.getElementById('projectIcon').focus();
  }, 100);
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
  .then(response => {
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return response.text().then(text => {
      try {
        return JSON.parse(text);
      } catch (e) {
        throw new Error(`Server error: ${text.substring(0, 100)}`);
      }
    });
  })
  .then(data => {
    if (data.success) {
      console.log('[OK] Project saved successfully:', data);
      Swal.fire('Berhasil', currentEditingProjectId ? 'Proyek berhasil diperbarui' : 'Proyek berhasil ditambahkan', 'success');
      closeProjectModal();
      loadProjects();
    } else {
      console.warn('[WARN] Save failed:', data.error);
      Swal.fire('Error', data.error || 'Gagal menyimpan proyek', 'error');
    }
  })
  .catch(error => {
    console.error('[ERROR] Error saving project:', error.message);
    console.warn('Check: Is API endpoint https://neoverse.my.id/api/save-projects.php working?');
    Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
  });
}

// Edit project
function editProject(projectId) {
  openProjectModal(projectId);
}

// Delete project
function deleteProject(projectId) {
  console.log('[DELETE] Delete button clicked for project ID:', projectId);
  currentEditingProjectId = projectId;
  // Langsung tampil dialog konfirmasi hapus, jangan buka modal edit
  deleteProjectWithConfirm();
}

// Delete project with confirmation
function deleteProjectWithConfirm() {
  console.log('[DELETE] Delete confirmation dialog for project ID:', currentEditingProjectId);
  // Find project by comparing as strings to avoid type mismatch
  const project = projects.find(p => String(p.id) === String(currentEditingProjectId));
  console.log('[DATA] Found project:', project);
  
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
      .then(response => {
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return response.text().then(text => {
          try {
            return JSON.parse(text);
          } catch (e) {
            throw new Error(`Server error: ${text.substring(0, 100)}`);
          }
        });
      })
      .then(data => {
        if (data.success) {
          console.log('[OK] Project deleted successfully');
          Swal.fire('Berhasil', 'Proyek berhasil dihapus', 'success');
          closeProjectModal();
          loadProjects();
        } else {
          console.warn('[WARN] Delete failed:', data.error);
          Swal.fire('Error', data.error || 'Gagal menghapus proyek', 'error');
        }
      })
      .catch(error => {
        console.error('[ERROR] Error deleting project:', error.message);
        console.warn('[INFO] Check: Is API endpoint https://neoverse.my.id/api/delete-projects.php working?');
        Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
      });
    }
  });
}