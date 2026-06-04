<?php
// Enable CORS for GitHub Pages cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

function parseSizeToBytes($value) {
    $value = trim((string) $value);
    if ($value === '') {
        return 0;
    }

    $unit = strtolower(substr($value, -1));
    $number = (float) $value;

    switch ($unit) {
        case 'g':
            return (int) ($number * 1024 * 1024 * 1024);
        case 'm':
            return (int) ($number * 1024 * 1024);
        case 'k':
            return (int) ($number * 1024);
        default:
            return (int) $number;
    }
}

function mimeToExtension($mimeType) {
    $map = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp',
    ];

    return $map[strtolower(trim((string) $mimeType))] ?? '';
}

function buildUploadErrorMessage($uploadError, $receivedFiles, $serverLimits) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'File melebihi upload_max_filesize di server',
        UPLOAD_ERR_FORM_SIZE => 'File melebihi batas MAX_FILE_SIZE dari form',
        UPLOAD_ERR_PARTIAL => 'File hanya terupload sebagian',
        UPLOAD_ERR_NO_FILE => 'Tidak ada file yang diterima server',
        UPLOAD_ERR_NO_TMP_DIR => 'Folder temporary upload tidak tersedia',
        UPLOAD_ERR_CANT_WRITE => 'Gagal menulis file ke disk',
        UPLOAD_ERR_EXTENSION => 'Upload dihentikan oleh ekstensi PHP',
    ];

    return ($errorMessages[$uploadError] ?? 'No file uploaded or upload error occurred') .
        ' (code: ' . $uploadError . ', files: ' . json_encode($receivedFiles) . ', limits: ' . json_encode($serverLimits) . ')';
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Path absolut ke folder foto_proyek (naik 2 level dari /CV/api/, hasilnya /CV/foto_proyek/)
$upload_dir = dirname(dirname(__DIR__)) . '/foto_proyek/';
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
        $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
        $postMaxSize = parseSizeToBytes(ini_get('post_max_size'));

        if ($contentLength > 0 && $postMaxSize > 0 && $contentLength > $postMaxSize) {
            http_response_code(413);
            echo json_encode([
                'success' => false,
                'message' => 'Request upload melebihi batas post_max_size server. Ukuran request: ' . $contentLength . ' bytes, batas: ' . ini_get('post_max_size')
            ]);
            exit;
        }

        $uploadedFile = $_FILES['projectPhoto'] ?? $_FILES['project_photo'] ?? null;
        $jsonPayload = null;
        $binaryData = null;
        $originalName = null;
        $detectedMime = null;
        $tempFilePath = null;

        if (!$uploadedFile || $uploadedFile['error'] !== UPLOAD_ERR_OK) {
            $serverLimits = [
                'upload_max_filesize' => ini_get('upload_max_filesize'),
                'post_max_size' => ini_get('post_max_size'),
                'max_file_uploads' => ini_get('max_file_uploads'),
                'file_uploads' => ini_get('file_uploads'),
                'upload_tmp_dir' => ini_get('upload_tmp_dir'),
                'content_length' => $_SERVER['CONTENT_LENGTH'] ?? null,
                'content_type' => $_SERVER['CONTENT_TYPE'] ?? null,
            ];

            $receivedFiles = array_keys($_FILES ?? []);
            $rawInput = file_get_contents('php://input');
            $jsonPayload = json_decode($rawInput, true);

            if (is_array($jsonPayload) && !empty($jsonPayload['projectPhotoData'])) {
                $dataUrl = (string) $jsonPayload['projectPhotoData'];
                $originalName = (string) ($jsonPayload['projectPhotoName'] ?? 'project-photo');

                if (preg_match('/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/', $dataUrl, $matches)) {
                    $detectedMime = strtolower($matches[1]);
                    $binaryData = base64_decode($matches[2], true);
                } else {
                    $detectedMime = strtolower((string) ($jsonPayload['projectPhotoType'] ?? ''));
                    $binaryData = base64_decode($dataUrl, true);
                }

                if ($binaryData === false || $binaryData === '') {
                    throw new Exception('Data foto tidak valid atau gagal didecode.');
                }

                $uploadedFile = [
                    'name' => $originalName,
                    'tmp_name' => '',
                    'size' => strlen($binaryData),
                    'error' => UPLOAD_ERR_OK,
                ];
            }

            if (!$uploadedFile || $uploadedFile['error'] !== UPLOAD_ERR_OK) {
                $uploadError = is_array($uploadedFile) ? ($uploadedFile['error'] ?? UPLOAD_ERR_NO_FILE) : UPLOAD_ERR_NO_FILE;
                throw new Exception(
                    buildUploadErrorMessage($uploadError, $receivedFiles, $serverLimits)
                );
            }
        }

        $file = $uploadedFile;
        
        // Validate MIME type with fallback to extension if fileinfo is unavailable
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        $mime_type = 'application/octet-stream';
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            if ($finfo) {
                if (!empty($binaryData)) {
                    $detectedMimeFromBuffer = finfo_buffer($finfo, $binaryData);
                    if ($detectedMimeFromBuffer) {
                        $mime_type = $detectedMimeFromBuffer;
                    }
                } else {
                    $detectedMimeFromFile = finfo_file($finfo, $file['tmp_name']);
                    if ($detectedMimeFromFile) {
                        $mime_type = $detectedMimeFromFile;
                    }
                }
                finfo_close($finfo);
            }
        }

        if ($mime_type === 'application/octet-stream' && !empty($detectedMime)) {
            $mime_type = $detectedMime;
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($ext === '') {
            $ext = mimeToExtension($mime_type);
        }

        $mimeAllowed = in_array($mime_type, $allowed_types, true);
        $extensionAllowed = in_array($ext, $allowed_extensions, true);

        if (!$mimeAllowed && !$extensionAllowed) {
            if (!empty($tempFilePath)) {
                @unlink($tempFilePath);
            }
            throw new Exception('File type tidak diizinkan. Hanya JPG, PNG, GIF, dan WEBP yang diterima.');
        }
        
        // Validate file size (max 5MB)
        $max_size = 5 * 1024 * 1024; // 5MB
        if (($file['size'] ?? 0) > $max_size) {
            if (!empty($tempFilePath)) {
                @unlink($tempFilePath);
            }
            throw new Exception('Ukuran file terlalu besar. Maksimal 5MB.');
        }
        
        // Generate unique filename with timestamp
        $filename = 'foto_proyek_' . time() . '_' . uniqid() . '.' . $ext;
        $filepath = $upload_dir . $filename;
        
        // Move uploaded file
        if (!empty($binaryData)) {
            if (file_put_contents($filepath, $binaryData) === false) {
                throw new Exception('Gagal menyimpan file.');
            }
        } elseif (!move_uploaded_file($file['tmp_name'], $filepath)) {
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