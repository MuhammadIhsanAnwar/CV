# Panduan Implementasi Projects Database CRUD

## 📋 Ringkasan Perubahan

Sistem portfolio Anda telah diperluas untuk mendukung manajemen projects yang sepenuhnya terintegrasi dengan database. Semua 7 projects yang sebelumnya hardcoded kini dapat dikelola melalui panel admin dengan fitur tambah, edit, dan hapus.

---

## 📁 File-File yang Dimodifikasi/Dibuat

### Database & API Layer
1. **api/setup-database.sql** (BARU)
   - Script SQL untuk membuat tabel `projects` di database
   - Berisi 7 default projects yang sudah ada sebelumnya

2. **api/get-projects.php** (BARU)
   - GET endpoint untuk mengambil semua projects
   - Response: JSON array dengan semua project data
   - Endpoint: `https://neoverse.my.id/api/get-projects.php`

3. **api/save-projects.php** (BARU)
   - POST endpoint untuk tambah/update project
   - Menerima JSON dengan data project
   - Response: `{success: true, id: xx, message: "..."}`
   - Endpoint: `https://neoverse.my.id/api/save-projects.php`

4. **api/delete-projects.php** (BARU)
   - DELETE endpoint untuk menghapus project
   - Menerima JSON dengan project id
   - Response: `{success: true, message: "..."}`
   - Endpoint: `https://neoverse.my.id/api/delete-projects.php`

### Admin Panel
5. **admin/admin.html** (MODIFIED)
   - Ditambahkan tab navigation untuk profil dan proyek
   - Ditambahkan UI untuk kelola projects (table + modal form)
   - Modal untuk tambah/edit dan konfirmasi hapus

### Frontend Pages
6. **index.html** (MODIFIED)
   - Projects section diganti dari hardcoded ke dynamic rendering
   - Menggunakan container `<div id="projectsGrid">` untuk display projects dinamis

### Styling
7. **css/style.css** (MODIFIED)
   - Ditambahkan CSS untuk admin tabs
   - Ditambahkan CSS untuk projects table
   - Ditambahkan CSS untuk project modal
   - Ditambahkan button styles (danger, primary)

### JavaScript
8. **js/admin.js** (MODIFIED)
   - Ditambahkan `switchTab()` untuk navigasi tab
   - Ditambahkan `loadProjects()` untuk fetch projects dari API
   - Ditambahkan `renderProjectsTable()` untuk render table di admin
   - Ditambahkan `openProjectModal()` untuk buka modal
   - Ditambahkan `closeProjectModal()` untuk tutup modal
   - Ditambahkan `saveProject()` untuk save project ke API
   - Ditambahkan `deleteProjectWithConfirm()` untuk delete dengan konfirmasi
   - Ditambahkan `deleteProject()` untuk delete ke API

9. **js/script.js** (MODIFIED)
   - Ditambahkan `loadProjects()` untuk fetch projects di halaman utama
   - Ditambahkan `renderProjects()` untuk render projects dynamically
   - Diupdate `loadData()` untuk juga meload projects

---

## 🗄️ Database Schema

### Tabel: projects

```sql
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(50) NOT NULL DEFAULT 'fas fa-code',
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  tech_stack JSON NOT NULL DEFAULT '[]',
  demo_link VARCHAR(500),
  github_link VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Struktur Data Project

```javascript
{
  id: 1,
  icon: "fas fa-school",
  title: "Website Sekolah",
  description: "Deskripsi lengkap project...",
  tech_stack: ["HTML", "CSS", "JavaScript"],
  demo_link: "https://demo.example.com", // nullable
  github_link: "https://github.com/user/repo",
  display_order: 1,
  created_at: "2025-01-17 10:00:00",
  updated_at: "2025-01-17 10:00:00"
}
```

---

## 🔧 Setup & Installation

### Step 1: Jalankan SQL Script di cPanel

1. Login ke cPanel
2. Buka **phpMyAdmin**
3. Pilih database `neoz6813_portofolio`
4. Klik tab **SQL**
5. Copy-paste isi file `api/setup-database.sql`
6. Klik **Go** untuk execute

Hasil: Tabel `projects` tercipta dengan 7 default projects.

### Step 2: Upload API Files

Upload ke cPanel (folder `/public_html/api/`):
- `api/get-projects.php`
- `api/save-projects.php`
- `api/delete-projects.php`

### Step 3: Update Local Files

Pastikan file-file berikut sudah tersinkronisasi:
- `admin/admin.html`
- `index.html`
- `css/style.css`
- `js/admin.js`
- `js/script.js`

### Step 4: Verify Setup

1. Buka https://neoverse.my.id (portfolio utama)
   - Projects harus ter-load dari database
   
2. Buka https://neoverse.my.id/admin/admin.html (admin panel)
   - Masukkan PIN: `10982345`
   - Klik tab "Proyek"
   - Tabel projects harus menampilkan 7 projects

---

## 📝 Cara Menggunakan

### Menambah Project Baru

1. Login ke admin panel (https://neoverse.my.id/admin/admin.html)
2. Masukkan PIN: `10982345`
3. Klik tab **Proyek**
4. Klik tombol **+ Tambah Proyek**
5. Isi form:
   - **Ikon Font Awesome**: `fas fa-code` (lihat https://fontawesome.com/icons)
   - **Judul Proyek**: Nama project
   - **Deskripsi**: Penjelasan lengkap
   - **Teknologi**: Pisahkan dengan koma (HTML, CSS, JavaScript)
   - **Live Demo** (opsional): Link ke live demo
   - **Repository GitHub**: Link ke github
   - **Urutan Tampil**: Nomor urutan di halaman
6. Klik **Simpan Proyek**

**Hasil**: Project baru muncul di halaman utama secara otomatis

### Mengedit Project yang Ada

1. Di tab **Proyek**, klik tombol **Edit** pada project
2. Form akan terbuka dengan data project yang akan diedit
3. Ubah data yang diperlukan
4. Klik **Simpan Proyek**

**Hasil**: Perubahan langsung tersimpan ke database dan halaman utama

### Menghapus Project

1. Di tab **Proyek**, klik tombol **Hapus** pada project
2. Muncul konfirmasi "Apakah Anda yakin?"
3. Klik **Ya, Hapus**

**Hasil**: Project dihapus dari database dan halaman utama

---

## 🔗 API Endpoints

### GET /api/get-projects.php

**Deskripsi**: Mengambil semua projects

**Request**:
```
GET https://neoverse.my.id/api/get-projects.php
```

**Response Success**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "icon": "fas fa-school",
      "title": "Website Sekolah",
      "description": "...",
      "tech_stack": ["HTML", "CSS", "JavaScript"],
      "demo_link": null,
      "github_link": "#",
      "display_order": 1,
      "created_at": "2025-01-17 10:00:00",
      "updated_at": "2025-01-17 10:00:00"
    }
  ],
  "message": "Projects retrieved successfully"
}
```

---

### POST /api/save-projects.php

**Deskripsi**: Tambah atau update project

**Request**:
```json
{
  "id": null,           // null untuk create, id untuk update
  "icon": "fas fa-code",
  "title": "Project Name",
  "description": "Project description",
  "tech_stack": ["HTML", "CSS", "JavaScript"],
  "demo_link": "https://demo.example.com",
  "github_link": "https://github.com/user/repo",
  "display_order": 1
}
```

**Response Success**:
```json
{
  "success": true,
  "id": 8,
  "message": "Project created successfully"
}
```

---

### POST /api/delete-projects.php

**Deskripsi**: Menghapus project

**Request**:
```json
{
  "id": 1
}
```

**Response Success**:
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## 🎨 UI/UX Features

### Admin Panel - Tab Navigation
- "Profil" tab: Mengelola data profile (existing)
- "Proyek" tab: Mengelola projects (baru)
- Smooth tab switching dengan animasi

### Admin Panel - Projects Table
- Tabel dengan columns: No, Ikon, Judul, Deskripsi, Teknologi, Urutan, Aksi
- Tombol Edit (biru) dan Hapus (merah) per project
- Hover effect untuk interaktivitas
- Responsive design untuk mobile

### Project Modal Form
- Clean form dengan validasi
- Field: Icon, Title, Description, Tech Stack, Demo Link, GitHub Link, Order
- Font Awesome icon picker dengan link referensi
- Delete button muncul hanya saat edit
- Close button (X) untuk menutup modal

### Homepage - Dynamic Projects
- Projects dimuat dari API saat halaman load
- Spinner loading indicator saat fetch data
- Smooth render dengan styling yang sama seperti sebelumnya
- Responsive grid layout

---

## ✅ Validasi & Error Handling

### Validasi Form
- Judul dan GitHub Link wajib diisi
- Icon harus format Font Awesome valid
- Demo Link harus URL valid (opsional)
- Display order harus number positif

### Error Handling
- **Network Error**: Tampil pesan "Gagal menghubungi server"
- **Validation Error**: Tampil pesan error spesifik
- **Database Error**: Server return error message
- **Console Logging**: Semua error di-log ke console untuk debug

---

## 🔄 Alur Data

```
Halaman Admin
    ↓
Click "Tambah Proyek"
    ↓
Modal Form terbuka
    ↓
Input data & click "Simpan"
    ↓
POST ke api/save-projects.php
    ↓
PHP validate & insert ke database
    ↓
Return success response
    ↓
Reload projects table
    ↓
User lihat project baru di table
    ↓
↓
Halaman Index
    ↓
Page load → loadData() (di script.js)
    ↓
loadProjects() fetch dari api/get-projects.php
    ↓
renderProjects() generate HTML & inject ke #projectsGrid
    ↓
Projects muncul di halaman
```

---

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Fully Supported
- Firefox: ✅ Fully Supported
- Safari: ✅ Fully Supported
- Mobile: ✅ Responsive Design
- IE11: ⚠️ Limited (Fetch API, ES6 syntax)

---

## 🔐 Security Notes

1. **SQL Injection Prevention**: Menggunakan `mysqli_real_escape_string()`
2. **CORS Headers**: Set untuk allow GitHub Pages access
3. **Input Validation**: Server-side validation pada API
4. **PIN Authentication**: Admin panel protected dengan PIN 10982345

---

## 🚀 Performance Tips

1. Projects di-cache di browser saat halaman load
2. Minimize API calls - hanya refresh saat user action
3. Lazy load images untuk projects (optional di masa depan)
4. Use CDN untuk Font Awesome icons (sudah implemented)

---

## 📞 Troubleshooting

### Projects tidak muncul di homepage

**Solusi:**
1. Buka DevTools (F12) → Console
2. Cek apakah ada error message
3. Verify API endpoint: https://neoverse.my.id/api/get-projects.php
4. Cek database - tabel `projects` sudah dibuat?

### Admin form tidak muncul

**Solusi:**
1. Verify PIN: `10982345`
2. Clear browser cache (Ctrl+Shift+Del)
3. Buka dalam private/incognito mode
4. Check sessionStorage: localStorage tidak lagi digunakan

### Project tidak tersimpan

**Solusi:**
1. Cek network tab (F12) → query get-projects.php response
2. Verify database connection di cPanel
3. Cek user privileges di MySQL
4. Lihat server error logs di cPanel

---

## 📚 Catatan Teknis

- **Data Persistence**: Projects disimpan di MySQL database
- **Real-time Sync**: Halaman utama auto-load projects terbaru saat dibuka
- **Stateless API**: Setiap request independent, tidak perlu login di API
- **JSON Storage**: tech_stack disimpan sebagai JSON array di MySQL TEXT field

---

## 🎯 Next Steps (Optional Features)

1. **Project Images**: Upload gambar untuk setiap project
2. **Project Categories**: Filter projects by category
3. **Project Stats**: View count, likes, stars counter
4. **Admin Notifications**: Email notification saat project ditambah
5. **Version History**: Track changes ke projects
6. **Export Projects**: Export projects list to PDF/CSV

---

**Created**: January 17, 2025 | **Last Updated**: January 17, 2025
