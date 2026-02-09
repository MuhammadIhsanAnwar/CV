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

// Reset form ke data asli
function resetForm() {
  loadAdminForm();
}
