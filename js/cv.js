// Profil data default
let cvProfileData = {
  name: "Nama",
  job: "Pekerjaan",
  email: "Email",
  phone: "+62 812-3456-7890",
  location: "Indonesia",
  bio: "Bio",
  about: "Tentang saya",
  education: ["Pendidikan 1", "Pendidikan 2"],
  skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  experience: ["Pengalaman 1", "Pengalaman 2"],
  achievement: ["Prestasi 1", "Prestasi 2"],
};

// Load CV data dari API saat halaman dibuka
function loadCVData() {
  console.log("[LOAD] Memuat data CV dari API...");
  
  fetch(`${API_BASE_URL}/get-profile.php`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("[OK] Data API diterima:", data);
      
      // Update data dengan API response
      cvProfileData.name = data.name || cvProfileData.name;
      cvProfileData.job = data.job || cvProfileData.job;
      cvProfileData.email = data.email || cvProfileData.email;
      cvProfileData.phone = data.phone || cvProfileData.phone;
      cvProfileData.location = data.location || cvProfileData.location;
      cvProfileData.bio = data.bio || cvProfileData.bio;
      cvProfileData.about = data.about || cvProfileData.about;

      // Parse array data jika ada
      try {
        if (data.education && typeof data.education === 'string') {
          cvProfileData.education = JSON.parse(data.education);
        } else if (Array.isArray(data.education)) {
          cvProfileData.education = data.education;
        }
      } catch (e) {
        console.warn("Tidak bisa parse education:", e);
      }

      try {
        if (data.skills && typeof data.skills === 'string') {
          cvProfileData.skills = JSON.parse(data.skills);
        } else if (Array.isArray(data.skills)) {
          cvProfileData.skills = data.skills;
        }
      } catch (e) {
        console.warn("Tidak bisa parse skills:", e);
      }

      try {
        if (data.experience && typeof data.experience === 'string') {
          cvProfileData.experience = JSON.parse(data.experience);
        } else if (Array.isArray(data.experience)) {
          cvProfileData.experience = data.experience;
        }
      } catch (e) {
        console.warn("Tidak bisa parse experience:", e);
      }

      try {
        if (data.achievement && typeof data.achievement === 'string') {
          cvProfileData.achievement = JSON.parse(data.achievement);
        } else if (Array.isArray(data.achievement)) {
          cvProfileData.achievement = data.achievement;
        }
      } catch (e) {
        console.warn("Tidak bisa parse achievement:", e);
      }

      console.log("[OK] Data CV berhasil dimuat:", cvProfileData);
      updateCVPage();
      loadCVPhoto(); // Load foto profil setelah data dimuat
    })
    .catch((error) => {
      console.error("[ERROR] Gagal memuat data dari API:", error.message);
      console.log("[INFO] Menggunakan data default sebagai fallback");
      updateCVPage();
    });
}

// Load foto profil dari API
function loadCVPhoto() {
  console.log("[LOAD] Memuat foto profil dari API...");
  
  fetch(`${API_BASE_URL}/upload-photos.php`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      // Try parsing as JSON
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("[ERROR] Invalid JSON from photo API:", text);
        throw new Error(`Server error: ${text.substring(0, 100)}`);
      }
    })
    .then((data) => {
      if (data.success && data.data && data.data.foto1) {
        console.log("[OK] Foto profil loaded:", data.data.foto1);
        
        // Update foto profil CV
        const cvProfilePhoto = document.getElementById("cvProfilePhoto");
        const cvProfilePlaceholder = document.getElementById("cvProfilePlaceholder");
        
        if (cvProfilePhoto) {
          cvProfilePhoto.src = "../foto/" + data.data.foto1;
          cvProfilePhoto.style.display = "block";
          console.log("[UPDATE] CV Profile photo updated");
        }
        
        // Hide placeholder jika foto berhasil dimuat
        if (cvProfilePlaceholder) {
          cvProfilePlaceholder.style.display = "none";
        }
      } else {
        console.warn("[WARN] No foto1 data from API");
      }
    })
    .catch((error) => {
      console.error("[ERROR] Gagal memuat foto profil:", error.message);
      console.log("[INFO] Menampilkan placeholder");
    });
}

// Update halaman dengan data terbaru
function updateCVPage() {
  // Update Header (NAMA & POSISI)
  const headerName = document.getElementById("cvFullName");
  const headerPosition = document.getElementById("cvPosition");
  
  if (headerName) {
    headerName.textContent = cvProfileData.name;
    console.log("[UPDATE] Header nama:", cvProfileData.name);
  }
  
  if (headerPosition) {
    headerPosition.textContent = cvProfileData.job;
    console.log("[UPDATE] Header posisi:", cvProfileData.job);
  }

  // Update Data Diri Section
  if (document.getElementById("cvName")) {
    document.getElementById("cvName").textContent = cvProfileData.name;
  }
  if (document.getElementById("cvJob")) {
    document.getElementById("cvJob").textContent = cvProfileData.job;
  }
  if (document.getElementById("cvEmail")) {
    document.getElementById("cvEmail").textContent = cvProfileData.email;
  }
  if (document.getElementById("cvPhone")) {
    document.getElementById("cvPhone").textContent = cvProfileData.phone;
  }
  if (document.getElementById("cvLocation")) {
    document.getElementById("cvLocation").textContent = cvProfileData.location;
  }

  // Update Tentang Saya
  if (document.getElementById("cvAbout")) {
    document.getElementById("cvAbout").textContent = cvProfileData.about;
  }

  // Update Pendidikan
  if (document.getElementById("cvEducation")) {
    const educationList = document.getElementById("cvEducation");
    educationList.innerHTML = cvProfileData.education
      .map((edu) => `<li>${edu}</li>`)
      .join("");
  }

  // Update Keahlian
  if (document.getElementById("cvSkills")) {
    const skillsList = document.getElementById("cvSkills");
    skillsList.innerHTML = cvProfileData.skills
      .map((skill) => `<li>${skill}</li>`)
      .join("");
  }

  // Update Pengalaman
  if (document.getElementById("cvExperience")) {
    const experienceList = document.getElementById("cvExperience");
    experienceList.innerHTML = cvProfileData.experience
      .map((exp) => `<li>${exp}</li>`)
      .join("");
  }

  // Update Prestasi
  if (document.getElementById("cvAchievement")) {
    const achievementList = document.getElementById("cvAchievement");
    achievementList.innerHTML = cvProfileData.achievement
      .map((ach) => `<li>${ach}</li>`)
      .join("");
  }
}

// Jalankan load data saat DOM siap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCVData);
} else {
  loadCVData();
}

function downloadPDF() {
  console.log("[DOWNLOAD] Generating professional PDF from server...");

  // Show loading message
  const btn = event.target.closest(".btn-download");
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  btn.disabled = true;

  // Create a temporary link to trigger download
  const link = document.createElement('a');
  link.href = `${API_BASE_URL}/generate-professional-cv.php`;
  link.download = '';
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Restore button after short delay
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    console.log("[OK] PDF download initiated!");
  }, 1000);
}
