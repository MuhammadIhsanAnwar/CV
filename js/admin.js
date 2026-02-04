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

// Load admin form saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  // Tunggu script.js selesai load
  setTimeout(loadAdminForm, 100);
});
