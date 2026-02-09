<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'koneksi.php';

// Query data dari database
$query = "SELECT * FROM profile WHERE id = 1";
$result = mysqli_query($koneksi, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    
    // Parse JSON fields
    $row['education'] = json_decode($row['education'], true) ?? [];
    $row['skills'] = json_decode($row['skills'], true) ?? [];
    $row['experience'] = json_decode($row['experience'], true) ?? [];
    $row['achievement'] = json_decode($row['achievement'], true) ?? [];
    
    // Return data sebagai JSON
    echo json_encode($row);
} else {
    // Jika data tidak ada, return data default
    echo json_encode([
        'name' => 'Nama Lengkap',
        'job' => 'Pekerjaan',
        'email' => 'Email',
        'phone' => 'Nomor WA',
        'location' => 'Lokasi',
        'bio' => 'Bio Singkat',
        'about' => 'Tentang Saya',
        'education' => [],
        'skills' => [],
        'experience' => [],
        'achievement' => []
    ]);
}

mysqli_close($koneksi);
?>