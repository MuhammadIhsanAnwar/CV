-- Buat tabel KONTAK untuk menyimpan informasi kontak dan media sosial

CREATE TABLE kontak (
    id INT PRIMARY KEY DEFAULT 1,
    email VARCHAR(100),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    twitter VARCHAR(255),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    tiktok VARCHAR(255),
    youtube VARCHAR(255),
    alamat TEXT,
    kota VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jika tabel sudah ada dan ingin menambahkan kolom yang hilang, gunakan:
-- ALTER TABLE kontak ADD COLUMN linkedin VARCHAR(255);
-- ALTER TABLE kontak ADD COLUMN tiktok VARCHAR(255);
-- dll untuk kolom lainnya

-- Atau jika ingin menghapus dan membuat ulang:
-- DROP TABLE IF EXISTS kontak;
-- Kemudian jalankan CREATE TABLE di atas

-- Insert data default (opsional)
INSERT INTO kontak (id, email, phone, whatsapp, linkedin, github, twitter, instagram, facebook, tiktok, youtube, alamat, kota) 
VALUES (1, '', '', '', '', '', '', '', '', '', '', '', '')
ON DUPLICATE KEY UPDATE id=1;
