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
        // Get admin PIN config dari database
        $result = mysqli_query($koneksi, "SELECT * FROM admin_config");
        
        $config = [];
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $config[$row['config_key']] = $row['config_value'];
            }
        }

        echo json_encode([
            'status' => 'success',
            'data' => $config
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['config_key']) || !isset($data['config_value'])) {
            throw new Exception('config_key dan config_value harus diisi');
        }

        $configKey = mysqli_real_escape_string($koneksi, $data['config_key']);
        $configValue = mysqli_real_escape_string($koneksi, $data['config_value']);

        // Check if config exists
        $checkQuery = "SELECT id FROM admin_config WHERE config_key = '$configKey'";
        $checkResult = mysqli_query($koneksi, $checkQuery);

        if (mysqli_num_rows($checkResult) > 0) {
            // Update existing
            $query = "UPDATE admin_config SET config_value = '$configValue', updated_at = CURRENT_TIMESTAMP WHERE config_key = '$configKey'";
        } else {
            // Insert new
            $query = "INSERT INTO admin_config (config_key, config_value) VALUES ('$configKey', '$configValue')";
        }

        if (mysqli_query($koneksi, $query)) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Konfigurasi berhasil diperbarui'
            ]);
        } else {
            throw new Exception(mysqli_error($koneksi));
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
