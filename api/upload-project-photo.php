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

// Path absolut ke root folder proyek ini, lalu ke folder foto_proyek
$upload_dir = dirname(__DIR__) . '/foto_proyek/';
if (!is_dir($upload_dir) && !mkdir($upload_dir, 0755, true)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: Gagal membuat folder upload di ' . $upload_dir
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Check if file was uploaded
        $uploadedFile = $_FILES['projectPhoto'] ?? $_FILES['project_photo'] ?? null;

        if (!$uploadedFile || $uploadedFile['error'] !== UPLOAD_ERR_OK) {
            $uploadError = $uploadedFile['error'] ?? UPLOAD_ERR_NO_FILE;
            $errorMessages = [
                UPLOAD_ERR_INI_SIZE => 'File melebihi upload_max_filesize di server',
                UPLOAD_ERR_FORM_SIZE => 'File melebihi batas MAX_FILE_SIZE dari form',
                UPLOAD_ERR_PARTIAL => 'File hanya terupload sebagian',
                UPLOAD_ERR_NO_FILE => 'Tidak ada file yang diterima server',
                UPLOAD_ERR_NO_TMP_DIR => 'Folder temporary upload tidak tersedia',
                UPLOAD_ERR_CANT_WRITE => 'Gagal menulis file ke disk',
                UPLOAD_ERR_EXTENSION => 'Upload dihentikan oleh ekstensi PHP',
            ];

            $serverLimits = [
                'upload_max_filesize' => ini_get('upload_max_filesize'),
                'post_max_size' => ini_get('post_max_size'),
                'max_file_uploads' => ini_get('max_file_uploads'),
            ];

            throw new Exception(
                ($errorMessages[$uploadError] ?? 'No file uploaded or upload error occurred') .
                ' (code: ' . $uploadError . ', limits: ' . json_encode($serverLimits) . ')'
            );
        }

        $file = $uploadedFile;
        
        // Validate MIME type with fallback to extension if fileinfo is unavailable
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        $mime_type = 'application/octet-stream';
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            if ($finfo) {
                $detectedMime = finfo_file($finfo, $file['tmp_name']);
                if ($detectedMime) {
                    $mime_type = $detectedMime;
                }
                finfo_close($finfo);
            }
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $mimeAllowed = in_array($mime_type, $allowed_types, true);
        $extensionAllowed = in_array($ext, $allowed_extensions, true);

        if (!$mimeAllowed && !$extensionAllowed) {
            throw new Exception('File type tidak diizinkan. Hanya JPG, PNG, GIF, dan WEBP yang diterima.');
        }
        
        // Validate file size (max 5MB)
        $max_size = 5 * 1024 * 1024; // 5MB
        if ($file['size'] > $max_size) {
            throw new Exception('Ukuran file terlalu besar. Maksimal 5MB.');
        }
        
        // Generate unique filename with timestamp
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