<?php
// Enable CORS for GitHub Pages cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Path absolut ke server neoverse.my.id
$upload_dir = $_SERVER['DOCUMENT_ROOT'] . '/foto_proyek/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Check if file was uploaded
        if (!isset($_FILES['projectPhoto']) || $_FILES['projectPhoto']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('No file uploaded or upload error occurred');
        }

        $file = $_FILES['projectPhoto'];
        
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
        $filename = 'foto_proyek_' . time() . '_' . uniqid() . '.' . $ext;
        $filepath = $upload_dir . $filename;
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new Exception('Gagal menyimpan file.');
        }
        
        // Set file permissions
        chmod($filepath, 0644);
        
        // Return URL lengkap untuk akses publik
        $public_url = 'https://neoverse.my.id/foto_proyek/' . $filename;
        
        $response = [
            'success' => true,
            'message' => 'Foto berhasil diupload',
            'filename' => $filename,
            'url' => $public_url,
            'path' => 'foto_proyek/' . $filename
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
?>