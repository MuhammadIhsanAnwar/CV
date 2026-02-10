<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Get contact info
        $resultContact = mysqli_query($koneksi, "SELECT * FROM contact_info LIMIT 1");
        $contact = mysqli_fetch_assoc($resultContact);

        // Get social media
        $resultSocial = mysqli_query($koneksi, "SELECT * FROM social_media ORDER BY order_position ASC");
        $socialMedia = [];
        while ($row = mysqli_fetch_assoc($resultSocial)) {
            $socialMedia[] = $row;
        }

        echo json_encode([
            'status' => 'success',
            'data' => [
                'contact' => $contact,
                'social_media' => $socialMedia
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
}
?>
