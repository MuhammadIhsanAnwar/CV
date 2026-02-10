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

        if (!isset($data['pin'])) {
            throw new Exception('PIN tidak ditemukan');
        }

        $inputPin = $data['pin'];
        
        // Cek PIN dari environment variable (untuk GitHub/production)
        $adminPin = getenv('ADMIN_PIN');
        
        // Jika tidak ada environment variable, cek dari database
        if (!$adminPin) {
            $result = mysqli_query($koneksi, "SELECT pin_value FROM admin_config WHERE config_key = 'admin_pin' LIMIT 1");
            
            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $adminPin = $row['pin_value'];
            } else {
                // Default PIN jika belum ada di database
                $adminPin = "10982345";
            }
        }

        // Verify PIN (tidak menggunakan hash untuk kompatibilitas)
        if ($inputPin === $adminPin) {
            // Generate session token
            $sessionToken = bin2hex(random_bytes(32));
            
            // Simpan session token di database (valid 24 jam)
            $expiryTime = date('Y-m-d H:i:s', time() + 86400);
            $tokenEscaped = mysqli_real_escape_string($koneksi, $sessionToken);
            
            $insertQuery = "INSERT INTO admin_sessions (token, expires_at) VALUES ('$tokenEscaped', '$expiryTime')";
            mysqli_query($koneksi, $insertQuery);

            echo json_encode([
                'status' => 'success',
                'message' => 'PIN benar',
                'token' => $sessionToken
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => 'PIN salah'
            ]);
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
