<?php
header('Content-Type: application/json');

// Allow upload from same domain and localhost
$allowed_origins = ['https://neoverse.my.id', 'http://localhost'];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Ensure folder exists
$upload_dir = __DIR__ . '/../foto_proyek/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Check if file was uploaded
        if (!isset($_FILES['project_photo']) || $_FILES['project_photo']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('No file uploaded or upload error occurred');
        }

        $file = $_FILES['project_photo'];
        
        // Validate MIME type
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mime_type, $allowed_types)) {
            throw new Exception('File type tidak diizinkan. Hanya JPG, PNG, GIF, dan WEBP yang diterima.');
        }
        
        // Validate file size (max 5MB)
        $max_size = 5 * 1024 * 1024; // 5MB
        if ($file['size'] > $max_size) {
            throw new Exception('Ukuran file terlalu besar. Maksimal 5MB.');
        }
        
        // Generate unique filename with timestamp
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'foto_proyek_' . time() . '.' . $ext;
        $filepath = $upload_dir . $filename;
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new Exception('Gagal menyimpan file.');
        }
        
        // Set file permissions
        chmod($filepath, 0644);
        
        $response = [
            'success' => true,
            'message' => 'Foto berhasil diupload',
            'filename' => $filename
        ];
        
        echo json_encode($response);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
