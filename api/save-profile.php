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
    $name = mysqli_real_escape_string($koneksi, $data['name']);
    $job = mysqli_real_escape_string($koneksi, $data['job']);
    $email = mysqli_real_escape_string($koneksi, $data['email']);
    $phone = mysqli_real_escape_string($koneksi, $data['phone']);
    $location = mysqli_real_escape_string($koneksi, $data['location']);
    $bio = mysqli_real_escape_string($koneksi, $data['bio']);
    $about = mysqli_real_escape_string($koneksi, $data['about']);

    // Convert array ke JSON
    $education = json_encode($data['education']);
    $skills = json_encode($data['skills']);
    $experience = json_encode($data['experience']);
    $achievement = json_encode($data['achievement']);

    // Update database
    $query = "UPDATE profile SET 
        name = '$name',
        job = '$job',
        email = '$email',
        phone = '$phone',
        location = '$location',
        bio = '$bio',
        about = '$about',
        education = '$education',
        skills = '$skills',
        experience = '$experience',
        achievement = '$achievement'
        WHERE id = 1";

    if (mysqli_query($koneksi, $query)) {
        echo json_encode(['success' => true, 'message' => 'Data berhasil disimpan']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($koneksi)]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Data tidak valid']);
}

mysqli_close($koneksi);
?>

<?php
// Hanya izinkan request dari domain Anda
$allowed_domain = 'https://neoverse.my.id';
if (!isset($_SERVER['HTTP_ORIGIN']) || $_SERVER['HTTP_ORIGIN'] !== $allowed_domain) {
    // Tambahkan PIN validation
    if (!isset($data['pin']) || $data['pin'] !== 'PIN_ANDA') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }
}
