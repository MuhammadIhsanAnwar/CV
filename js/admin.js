// PIN Password
const ADMIN_PIN = "10982345";
let isAuthenticated = false;

// Projects data
let projects = [];
let currentEditingProjectId = null;

// ===== UTILITY FUNCTIONS =====

// Parse JSON response safely
function parseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON: ${text.substring(0, 100)}`);
  }
}

// Handle fetch response (convert to JSON)
function handleFetchResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }
  return response.text().then(text => parseJSON(text));
}

// Fill admin form with profile data
function fillAdminForm(data) {
  document.getElementById('adminName').value = data.name || '';
  document.getElementById('adminJob').value = data.job || '';
  document.getElementById('adminEmail').value = data.email || '';
  document.getElementById('adminPhone').value = data.phone || '';
  document.getElementById('adminLocation').value = data.location || '';
  document.getElementById('adminBio').value = data.bio || '';
  document.getElementById('adminAbout').value = data.about || '';
  document.getElementById('adminEducation').value = (data.education || []).join(', ');
  document.getElementById('adminSkills').value = (data.skills || []).join(', ');
  document.getElementById('adminExperience').value = (data.experience || []).join(', ');
  document.getElementById('adminAchievement').value = (data.achievement || []).join(', ');
}

// ===== PASSWORD & AUTHENTICATION =====
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

function logout() {
  sessionStorage.removeItem('adminAuthenticated');
  isAuthenticated = false;
  window.location.href = '../index.html';
}

function goBack() {
  window.location.href = '../index.html';
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
  // Handle password input
  const passwordInput = document.getElementById('passwordInput');
  if (passwordInput) {
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        verifyPassword();
      }
    });
    passwordInput.focus();
  }

  // Check authentication status
  if (sessionStorage.getItem('adminAuthenticated') === 'true') {
    isAuthenticated = true;
    document.getElementById('passwordModal').classList.remove('show');
    document.getElementById('blurOverlay').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    setTimeout(() => {
      loadAdminForm();
      loadProjects();
    }, 100);
  } else {
    document.getElementById('blurOverlay').style.display = 'block';
  }

  // Project form submission
  const projectForm = document.getElementById('projectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveProjectWithPhoto();
    });
  }

  // Project photo preview
  const photoInput = document.getElementById('projectPhoto');
  if (photoInput) {
    photoInput.addEventListener('change', function(e) {
      handlePhotoPreview(e, 'projectPhotoPreview');
    });
  }

  // Profile photo previews
  setupPhotoPreview('adminFoto1', 'preview1');
  setupPhotoPreview('adminFoto2', 'preview2');
  setupPhotoPreview('adminFoto3', 'preview3');

  // Load current profile photos
  loadCurrentPhotos();
});

// ===== PROFILE MANAGEMENT =====

function loadAdminForm() {
  fetch(`${API_BASE_URL}/get-profile.php`)
    .then(handleFetchResponse)
    .then(data => {
      // Update profileData
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
      
      fillAdminForm(profileData);
      console.log('[OK] Admin form loaded from API');
    })
    .catch(error => {
      console.error('[ERROR] Error loading form data:', error.message);
      console.warn('[INFO] Check: Is API endpoint https://neoverse.my.id/api/get-profile.php working?');
      fillAdminForm(profileData);
      console.log('[INFO] Using default data as fallback');
    });
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

// ===== PROJECT MANAGEMENT =====

function switchTab(tab) {
  document.getElementById('tabProfil').classList.remove('active');
  document.getElementById('tabProyek').classList.remove('active');
  document.getElementById('tabKontak').classList.remove('active');
  
  if (tab === 'profil') {
    document.getElementById('tabProfil').classList.add('active');
    document.getElementById('profilSection').style.display = 'block';
    document.getElementById('proyekSection').style.display = 'none';
    document.getElementById('kontakSection').style.display = 'none';
  } else if (tab === 'proyek') {
    document.getElementById('tabProyek').classList.add('active');
    document.getElementById('profilSection').style.display = 'none';
    document.getElementById('proyekSection').style.display = 'block';
    document.getElementById('kontakSection').style.display = 'none';
    loadProjects();
  } else if (tab === 'kontak') {
    document.getElementById('tabKontak').classList.add('active');
    document.getElementById('profilSection').style.display = 'none';
    document.getElementById('proyekSection').style.display = 'none';
    document.getElementById('kontakSection').style.display = 'block';
    loadKontakForm();
  }
}

function loadProjects() {
  fetch(`${API_BASE_URL}/get-projects.php`)
    .then(handleFetchResponse)
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
      console.warn('[INFO] Check: Is API endpoint https://neoverse.my.id/api/get-projects.php working?');
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
      <td>${project.foto_proyek ? `<img src="../foto_proyek/${project.foto_proyek}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" alt="${project.title}">` : '<span style="color: #999;">Tidak ada foto</span>'}</td>
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
      document.getElementById('projectTitle').value = project.title || '';
      document.getElementById('projectDescription').value = project.description || '';
      document.getElementById('projectTech').value = Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : '';
      document.getElementById('projectDemoLink').value = project.demo_link || '';
      document.getElementById('projectGithubLink').value = project.github_link || '';
      document.getElementById('projectOrder').value = project.display_order || 1;
      
      // Load existing photo if available
      const photoPreview = document.getElementById('projectPhotoPreview');
      if (project.foto_proyek) {
        photoPreview.src = '../foto_proyek/' + project.foto_proyek;
        photoPreview.style.display = 'block';
      } else {
        photoPreview.style.display = 'none';
      }
      
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
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('projectTech').value = '';
    document.getElementById('projectDemoLink').value = '';
    document.getElementById('projectGithubLink').value = '';
    document.getElementById('projectOrder').value = projects.length + 1 || 1;
    document.getElementById('projectPhotoPreview').style.display = 'none';
    deleteBtn.style.display = 'none';
  }
  
  modal.classList.add('show');
  overlay.classList.add('show');
  
  // Focus on first input field
  setTimeout(() => {
    document.getElementById('projectPhoto').focus();
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

// Save project with photo (insert or update)
function saveProjectWithPhoto() {
  const projectPhoto = document.getElementById('projectPhoto').files[0];
  const projectData = {
    title: document.getElementById('projectTitle').value.trim(),
    description: document.getElementById('projectDescription').value.trim(),
    tech_stack: document.getElementById('projectTech').value
      .split(',').map(t => t.trim()).filter(t => t),
    demo_link: document.getElementById('projectDemoLink').value.trim() || null,
    github_link: document.getElementById('projectGithubLink').value.trim(),
    display_order: parseInt(document.getElementById('projectOrder').value)
  };

  // Validate required fields
  if (!projectData.title || !projectData.description || !projectData.github_link) {
    Swal.fire('Error', 'Harap isi semua field yang wajib', 'error');
    return;
  }

  if (currentEditingProjectId) {
    projectData.id = currentEditingProjectId;
  }

  // If there's a photo, upload it first
  if (projectPhoto) {
    const formData = new FormData();
    formData.append('project_photo', projectPhoto);
    if (currentEditingProjectId) {
      formData.append('project_id', currentEditingProjectId);
    }

    console.log('[UPLOAD] Uploading project photo...');

    fetch(`${API_BASE_URL}/upload-project-photo.php`, {
      method: 'POST',
      body: formData
    })
    .then(handleFetchResponse)
    .then(photoData => {
      if (photoData.success) {
        console.log('[OK] Project photo uploaded:', photoData.filename);
        projectData.foto_proyek = photoData.filename;
        saveProjectData(projectData);
      } else {
        console.warn('[WARN] Photo upload failed:', photoData.message);
        Swal.fire('Error', photoData.message || 'Gagal upload foto proyek', 'error');
      }
    })
    .catch(error => {
      console.error('[ERROR] Error uploading photo:', error.message);
      Swal.fire('Error', 'Gagal upload foto: ' + error.message, 'error');
    });
  } else {
    // No photo, just save project data
    saveProjectData(projectData);
  }
}

// Save project data to database
function saveProjectData(projectData) {
  // Remove icon field - we're using foto_proyek now
  delete projectData.icon;
  
  fetch(`${API_BASE_URL}/save-projects.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  })
  .then(handleFetchResponse)
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
    console.warn('[INFO] Check: Is API endpoint https://neoverse.my.id/api/save-projects.php working?');
    Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
  });
}

function editProject(projectId) {
  openProjectModal(projectId);
}

function deleteProject(projectId) {
  console.log('[DELETE] Delete button clicked for project ID:', projectId);
  currentEditingProjectId = projectId;
  deleteProjectWithConfirm();
}

function deleteProjectWithConfirm() {
  console.log('[DELETE] Delete confirmation dialog for project ID:', currentEditingProjectId);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentEditingProjectId })
      })
      .then(handleFetchResponse)
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

// ===== PHOTO MANAGEMENT =====

function setupPhotoPreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (input) {
    input.addEventListener('change', function(e) {
      handlePhotoPreview(e, previewId);
    });
  }
}

function handlePhotoPreview(e, previewId) {
  const file = e.target.files[0];
  const preview = document.getElementById(previewId);
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(event) {
      preview.src = event.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

// Load current photos dari database
function loadCurrentPhotos() {
  fetch(`${API_BASE_URL}/upload-photos.php`)
    .then(handleFetchResponse)
    .then(data => {
      if (data.success && data.data) {
        console.log('[OK] Current photos loaded:', data.data);
        if (data.data.foto1) updatePhotoPreview('preview1', data.data.foto1);
        if (data.data.foto2) updatePhotoPreview('preview2', data.data.foto2);
        if (data.data.foto3) updatePhotoPreview('preview3', data.data.foto3);
      }
    })
    .catch(error => {
      console.warn('[WARN] Could not load current photos:', error.message);
    });
}

function updatePhotoPreview(previewId, photoName) {
  const img = document.getElementById(previewId);
  if (img) {
    img.src = '../foto/' + photoName;
    img.style.display = 'block';
  }
}

// Upload photos ke server
function uploadPhotos() {
  const foto1 = document.getElementById('adminFoto1').files[0];
  const foto2 = document.getElementById('adminFoto2').files[0];
  const foto3 = document.getElementById('adminFoto3').files[0];

  if (!foto1 && !foto2 && !foto3) {
    Swal.fire('Peringatan', 'Pilih minimal satu foto untuk diupload', 'warning');
    return;
  }

  const formData = new FormData();
  if (foto1) formData.append('foto1', foto1);
  if (foto2) formData.append('foto2', foto2);
  if (foto3) formData.append('foto3', foto3);

  console.log('[UPLOAD] Uploading photos...');

  fetch(`${API_BASE_URL}/upload-photos.php`, {
    method: 'POST',
    body: formData
  })
  .then(handleFetchResponse)
  .then(data => {
    if (data.success) {
      console.log('[OK] Photos uploaded successfully:', data.uploadedFiles);
      document.getElementById('adminFoto1').value = '';
      document.getElementById('adminFoto2').value = '';
      document.getElementById('adminFoto3').value = '';
      loadCurrentPhotos();
      Swal.fire('Berhasil!', 'Foto berhasil diupload dan disimpan ke database', 'success');
    } else {
      console.warn('[WARN] Upload failed:', data.message);
      Swal.fire('Error', data.message || 'Gagal mengupload foto', 'error');
    }
  })
  .catch(error => {
    console.error('[ERROR] Error uploading photos:', error.message);
    Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
  });
}

// ===== KONTAK MANAGEMENT =====

function fillKontakForm(data) {
  document.getElementById('kontakEmail').value = data.email || '';
  document.getElementById('kontakPhone').value = data.phone || '';
  document.getElementById('kontakWhatsapp').value = data.whatsapp || '';
  document.getElementById('kontakLinkedin').value = data.linkedin || '';
  document.getElementById('kontakGithub').value = data.github || '';
  document.getElementById('kontakTwitter').value = data.twitter || '';
  document.getElementById('kontakInstagram').value = data.instagram || '';
  document.getElementById('kontakFacebook').value = data.facebook || '';
  document.getElementById('kontakTiktok').value = data.tiktok || '';
  document.getElementById('kontakYoutube').value = data.youtube || '';
  document.getElementById('kontakAlamat').value = data.alamat || '';
  document.getElementById('kontakKota').value = data.kota || '';
}

function loadKontakForm() {
  fetch(`${API_BASE_URL}/get-kontak.php`)
    .then(handleFetchResponse)
    .then(data => {
      console.log('[OK] Kontak data loaded from API:', data);
      fillKontakForm(data);
    })
    .catch(error => {
      console.error('[ERROR] Error loading kontak form:', error.message);
      console.warn('[INFO] Check: Is API endpoint https://neoverse.my.id/api/get-kontak.php working?');
      fillKontakForm({});
      console.log('[INFO] Using empty data as fallback');
    });
}

function saveKontakWithConfirm() {
  // Validasi email
  const email = document.getElementById('kontakEmail').value.trim();
  if (!email) {
    Swal.fire('Validasi', 'Email tidak boleh kosong', 'warning');
    return;
  }

  Swal.fire({
    title: 'Konfirmasi',
    text: 'Simpan data kontak yang telah diubah?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Simpan',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#667eea',
    cancelButtonColor: '#ccc'
  }).then((result) => {
    if (result.isConfirmed) {
      saveKontak();
    }
  });
}

function saveKontak() {
  const kontakData = {
    email: document.getElementById('kontakEmail').value.trim(),
    phone: document.getElementById('kontakPhone').value.trim(),
    whatsapp: document.getElementById('kontakWhatsapp').value.trim(),
    linkedin: document.getElementById('kontakLinkedin').value.trim(),
    github: document.getElementById('kontakGithub').value.trim(),
    twitter: document.getElementById('kontakTwitter').value.trim(),
    instagram: document.getElementById('kontakInstagram').value.trim(),
    facebook: document.getElementById('kontakFacebook').value.trim(),
    tiktok: document.getElementById('kontakTiktok').value.trim(),
    youtube: document.getElementById('kontakYoutube').value.trim(),
    alamat: document.getElementById('kontakAlamat').value.trim(),
    kota: document.getElementById('kontakKota').value.trim()
  };

  console.log('[INFO] Saving kontak data:', kontakData);

  fetch(`${API_BASE_URL}/save-kontak.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(kontakData)
  })
  .then(handleFetchResponse)
  .then(data => {
    if (data.success) {
      console.log('[OK] Kontak data saved successfully');
      Swal.fire('Berhasil!', 'Data kontak berhasil disimpan', 'success');
      document.getElementById('successMessage').style.display = 'block';
      setTimeout(() => {
        document.getElementById('successMessage').style.display = 'none';
      }, 3000);
    } else {
      console.warn('[WARN] Save failed:', data.message);
      Swal.fire('Error', data.message || 'Gagal menyimpan data kontak', 'error');
    }
  })
  .catch(error => {
    console.error('[ERROR] Error saving kontak data:', error.message);
    Swal.fire('Error', 'Gagal menghubungi server: ' + error.message, 'error');
  });
}