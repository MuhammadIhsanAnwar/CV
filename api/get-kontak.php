<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'koneksi.php';

// Ambil data kontak dari database
$query = "SELECT * FROM kontak WHERE id = 1";
$result = mysqli_query($koneksi, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    
    echo json_encode([
        'id' => $row['id'],
        'email' => $row['email'],
        'phone' => $row['phone'],
        'website' => $row['website'],
        'whatsapp' => $row['whatsapp'],
        'linkedin' => $row['linkedin'],
        'github' => $row['github'],
        'twitter' => $row['twitter'],
        'instagram' => $row['instagram'],
        'facebook' => $row['facebook'],
        'tiktok' => $row['tiktok'],
        'youtube' => $row['youtube'],
        'alamat' => $row['alamat'],
        'kota' => $row['kota'],
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at']
    ]);
} else {
    // Return default empty values if no data
    echo json_encode([
        'id' => 1,
        'email' => '',
        'phone' => '',
        'website' => '',
        'whatsapp' => '',
        'linkedin' => '',
        'github' => '',
        'twitter' => '',
        'instagram' => '',
        'facebook' => '',
        'tiktok' => '',
        'youtube' => '',
        'alamat' => '',
        'kota' => '',
        'created_at' => null,
        'updated_at' => null
    ]);
}

mysqli_close($koneksi);
?>
