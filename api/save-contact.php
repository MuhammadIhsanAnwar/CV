<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['type'])) {
            if ($data['type'] === 'contact') {
                // Update contact info
                $email = mysqli_real_escape_string($koneksi, $data['email']);
                $phone = mysqli_real_escape_string($koneksi, $data['phone']);
                $location = mysqli_real_escape_string($koneksi, $data['location']);
                $website = mysqli_real_escape_string($koneksi, $data['website']);

                $query = "UPDATE contact_info SET 
                    email = '$email',
                    phone = '$phone',
                    location = '$location',
                    website = '$website'
                    WHERE id = 1";

                if (mysqli_query($koneksi, $query)) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Contact info berhasil diperbarui'
                    ]);
                } else {
                    throw new Exception(mysqli_error($koneksi));
                }
            } 
            elseif ($data['type'] === 'social_media') {
                // Update social media
                $updates = $data['social_media'];
                $successCount = 0;
                $errorCount = 0;

                foreach ($updates as $social) {
                    $platform = mysqli_real_escape_string($koneksi, $social['platform']);
                    $urls = mysqli_real_escape_string($koneksi, $social['urls']);
                    $is_active = $social['is_active'] ? 1 : 0;
                    $order_position = intval($social['order_position']);

                    $query = "UPDATE social_media SET 
                        urls = '$urls',
                        is_active = $is_active,
                        order_position = $order_position
                        WHERE platform = '$platform'";

                    if (mysqli_query($koneksi, $query)) {
                        $successCount++;
                    } else {
                        $errorCount++;
                    }
                }

                if ($errorCount === 0) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Social media berhasil diperbarui ($successCount items)"
                    ]);
                } else {
                    throw new Exception("Gagal update beberapa item: $errorCount");
                }
            }
            else {
                throw new Exception('Tipe tidak valid');
            }
        } else {
            throw new Exception('Tipe data tidak ditemukan');
        }
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
}
?>
