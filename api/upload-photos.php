<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Connect to database
require_once('koneksi.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $response = array('success' => false, 'message' => '');
        
        // Check if files are uploaded
        if (empty($_FILES)) {
            http_response_code(400);
            $response['message'] = 'No files uploaded';
            echo json_encode($response);
            exit;
        }
        
        // Define upload directory
        $uploadDir = __DIR__ . '/../foto/';
        
        // Create directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                http_response_code(500);
                $response['message'] = 'Gagal membuat direktori upload';
                echo json_encode($response);
                exit;
            }
        }
        
        $uploadedFiles = array(
            'foto1' => null,
            'foto2' => null,
            'foto3' => null
        );
        
        $updates = array();
        
        // Process each photo upload
        $photoFields = array('foto1', 'foto2', 'foto3');
        
        foreach ($photoFields as $field) {
            if (isset($_FILES[$field]) && $_FILES[$field]['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES[$field];
                
                // Validate file type using MIME type
                $allowedTypes = array('image/jpeg', 'image/png', 'image/gif', 'image/webp');
                
                // Try to get MIME type using finfo if available
                $mimeType = 'application/octet-stream';
                if (function_exists('finfo_file')) {
                    $finfo = finfo_open(FILEINFO_MIME_TYPE);
                    $mimeType = finfo_file($finfo, $file['tmp_name']);
                    finfo_close($finfo);
                } else {
                    // Fallback: check file extension
                    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                    $extToMime = array('jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif', 'webp' => 'image/webp');
                    $mimeType = $extToMime[$ext] ?? 'application/octet-stream';
                }
                
                if (!in_array($mimeType, $allowedTypes)) {
                    http_response_code(400);
                    $response['message'] = "File {$field} bukan tipe gambar yang valid (MIME: {$mimeType})";
                    echo json_encode($response);
                    exit;
                }
                
                // Validate file size (max 5MB)
                $maxSize = 5 * 1024 * 1024;
                if ($file['size'] > $maxSize) {
                    http_response_code(413);
                    $response['message'] = 'Ukuran file terlalu besar. Maksimal 5MB.';
                    echo json_encode($response);
                    exit;
                }
                
                // Generate unique filename
                $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                $filename = $field . '_' . time() . '.' . $ext;
                $filepath = $uploadDir . $filename;
                
                // Move uploaded file
                if (!move_uploaded_file($file['tmp_name'], $filepath)) {
                    http_response_code(500);
                    $response['message'] = "Gagal menyimpan file {$field}";
                    error_log('Failed to move uploaded file to: ' . $filepath);
                    echo json_encode($response);
                    exit;
                }
                
                // Set permissions
                chmod($filepath, 0644);
                
                $uploadedFiles[$field] = $filename;
                $updates[] = $field . " = '" . $conn->real_escape_string($filename) . "'";
            }
        }
        
        // Update database with new filenames
        if (!empty($updates)) {
            $sql = "UPDATE profile SET " . implode(', ', $updates) . " LIMIT 1";
            
            if (!$conn->query($sql)) {
                $response['message'] = 'Error updating database: ' . $conn->error;
                error_log('SQL Error in upload-photos.php: ' . $conn->error . ' | SQL: ' . $sql);
                http_response_code(400);
                echo json_encode($response);
                exit;
            }
        }
        
        $response['success'] = true;
        $response['message'] = 'Foto berhasil diupload dan disimpan';
        $response['uploadedFiles'] = $uploadedFiles;
        
        echo json_encode($response);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array(
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ));
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get current photo filenames
    try {
        $result = $conn->query("SELECT foto1, foto2, foto3 FROM profile LIMIT 1");
        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode(array(
                'success' => true,
                'data' => $row
            ));
        } else {
            echo json_encode(array(
                'success' => true,
                'data' => array('foto1' => null, 'foto2' => null, 'foto3' => null)
            ));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array(
            'success' => false,
            'message' => $e->getMessage()
        ));
    }
} else {
    http_response_code(405);
    echo json_encode(array(
        'success' => false,
        'message' => 'Invalid request method'
    ));
}

$conn->close();
?>
        }
    } catch (Exception $e) {
        echo json_encode(array(
            'success' => false,
            'message' => $e->getMessage()
        ));
    }
} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'Invalid request method'
    ));
}

$conn->close();
?>
