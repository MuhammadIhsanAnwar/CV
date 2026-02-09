-- Create profile table
CREATE TABLE IF NOT EXISTS profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  job VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  location VARCHAR(255),
  bio TEXT,
  about TEXT,
  education JSON,
  skills JSON,
  experience JSON,
  achievement JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default profile data
INSERT INTO profile (name, job, email, phone, location, bio, about, education, skills, experience, achievement) VALUES
('Ihsan Anwar', 'Full Stack Developer', 'ihsananwar@example.com', '+62 XXX XXX XXX', 'Jakarta, Indonesia', 'Enthusiastic developer passionate about web development', 'Professional developer with expertise in various technologies', '[]', '[]', '[]', '[]')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default projects data
INSERT INTO projects (icon, title, description, tech_stack, demo_link, github_link, display_order) VALUES
('fas fa-school', 'Website Sekolah', 'Website resmi sekolah dengan fitur informasi akademik, jadwal pelajaran, galeri kegiatan, dan profil guru yang dirancang responsive untuk semua perangkat.', '["HTML","CSS","JavaScript"]', NULL, '#', 1),
('fas fa-calculator', 'Kalkulator Digital', 'Aplikasi kalkulator modern dengan interface yang intuitif, mendukung operasi matematika dasar dan lanjutan dengan fitur history perhitungan.', '["HTML","CSS","JavaScript"]', NULL, '#', 2),
('fas fa-store', 'Website Toko Sederhana', 'Website toko online sederhana dengan katalog produk, keranjang belanja, dan checkout yang user-friendly untuk pengalaman belanja yang nyaman dan efisien.', '["HTML","CSS","JavaScript"]', NULL, '#', 3),
('fas fa-shopping-cart', 'Website Online Store', 'Platform e-commerce lengkap dengan katalog produk, shopping cart, integrasi pembayaran, dan dashboard admin untuk manajemen inventory real-time.', '["HTML","CSS","JavaScript","Bootstrap","PHP"]', NULL, '#', 4),
('fas fa-cash-register', 'Sistem Manajemen Kasir', 'Aplikasi desktop untuk manajemen penjualan dengan sistem cashier, laporan penjualan, dan manajemen inventory yang efisien dan mudah digunakan.', '["C"]', NULL, '#', 5),
('fas fa-poll', 'Website Survey Pemerintah', 'Platform survey online untuk mengumpulkan feedback publik dengan fitur validasi data, analytics dashboard, dan laporan komprehensif untuk evaluasi kebijakan.', '["HTML","CSS","JavaScript"]', NULL, '#', 6),
('fas fa-user-circle', 'Portofolio Personal', 'Website portofolio profesional dengan showcase projects, skills, experience, dan live case studies yang dirancang responsif dengan modern UI/UX design.', '["HTML","CSS","JavaScript","Bootstrap"]', 'https://neoverse.my.id', '#', 7);
