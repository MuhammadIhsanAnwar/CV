<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

require 'koneksi.php';

// Terima JSON dari JavaScript
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data) {
    // Escape data untuk security
    $email = mysqli_real_escape_string($koneksi, $data['email']);
    $phone = mysqli_real_escape_string($koneksi, $data['phone']);
    $whatsapp = mysqli_real_escape_string($koneksi, $data['whatsapp']);
    $linkedin = mysqli_real_escape_string($koneksi, $data['linkedin']);
    $github = mysqli_real_escape_string($koneksi, $data['github']);
    $twitter = mysqli_real_escape_string($koneksi, $data['twitter']);
    $instagram = mysqli_real_escape_string($koneksi, $data['instagram']);
    $facebook = mysqli_real_escape_string($koneksi, $data['facebook']);
    $tiktok = mysqli_real_escape_string($koneksi, $data['tiktok']);
    $youtube = mysqli_real_escape_string($koneksi, $data['youtube']);
    $alamat = mysqli_real_escape_string($koneksi, $data['alamat']);
    $kota = mysqli_real_escape_string($koneksi, $data['kota']);

    // Check if contact exists
    $checkQuery = "SELECT id FROM kontak WHERE id = 1";
    $checkResult = mysqli_query($koneksi, $checkQuery);
    
    if (mysqli_num_rows($checkResult) > 0) {
        // Update database
        $query = "UPDATE kontak SET 
            email = '$email',
            phone = '$phone',
            whatsapp = '$whatsapp',
            linkedin = '$linkedin',
            github = '$github',
            twitter = '$twitter',
            instagram = '$instagram',
            facebook = '$facebook',
            tiktok = '$tiktok',
            youtube = '$youtube',
            alamat = '$alamat',
            kota = '$kota',
            updated_at = NOW()
            WHERE id = 1";
    } else {
        // Insert new contact
        $query = "INSERT INTO kontak (email, phone, whatsapp, linkedin, github, twitter, instagram, facebook, tiktok, youtube, alamat, kota, created_at, updated_at)
            VALUES ('$email', '$phone', '$whatsapp', '$linkedin', '$github', '$twitter', '$instagram', '$facebook', '$tiktok', '$youtube', '$alamat', '$kota', NOW(), NOW())";
    }

    if (mysqli_query($koneksi, $query)) {
        echo json_encode(['success' => true, 'message' => 'Data kontak berhasil disimpan']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($koneksi)]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Data tidak valid']);
}

mysqli_close($koneksi);
?>
