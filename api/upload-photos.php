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
            $response['message'] = 'No files uploaded';
            echo json_encode($response);
            exit;
        }
        
        // Define upload directory
        $uploadDir = __DIR__ . '/../foto/';
        
        // Create directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $uploadedFiles = array(
            'foto1' => null,
            'foto2' => null,
            'foto3' => null
        );
        
        // Process each photo upload
        $photoFields = array('foto1', 'foto2', 'foto3');
        
        foreach ($photoFields as $field) {
            if (isset($_FILES[$field]) && $_FILES[$field]['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES[$field];
                
                // Validate file type
                $allowedTypes = array('image/jpeg', 'image/png', 'image/gif', 'image/webp');
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mimeType = finfo_file($finfo, $file['tmp_name']);
                finfo_close($finfo);
                
                if (!in_array($mimeType, $allowedTypes)) {
                    $response['message'] = "File {$field} bukan tipe gambar yang valid";
                    echo json_encode($response);
                    exit;
                }
                
                // Validate file size (max 5MB)
                if ($file['size'] > 5 * 1024 * 1024) {
                    $response['message'] = "File {$field} terlalu besar (max 5MB)";
                    echo json_encode($response);
                    exit;
                }
                
                // Generate unique filename
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = 'fotoprofil' . (str_replace('foto', '', $field)) . '_' . time() . '.' . $ext;
                $filepath = $uploadDir . $filename;
                
                // Move uploaded file
                if (!move_uploaded_file($file['tmp_name'], $filepath)) {
                    $response['message'] = "Gagal upload file {$field}";
                    echo json_encode($response);
                    exit;
                }
                
                // Set permissions
                chmod($filepath, 0644);
                
                $uploadedFiles[$field] = $filename;
            }
        }
        
        // Update database with new filenames
        $updates = array();
        if ($uploadedFiles['foto1']) $updates[] = "foto1 = '" . $conn->real_escape_string($uploadedFiles['foto1']) . "'";
        if ($uploadedFiles['foto2']) $updates[] = "foto2 = '" . $conn->real_escape_string($uploadedFiles['foto2']) . "'";
        if ($uploadedFiles['foto3']) $updates[] = "foto3 = '" . $conn->real_escape_string($uploadedFiles['foto3']) . "'";
        
        if (!empty($updates)) {
            $sql = "UPDATE profile SET " . implode(', ', $updates) . " LIMIT 1";
            
            if (!$conn->query($sql)) {
                $response['message'] = 'Error updating database: ' . $conn->error;
                echo json_encode($response);
                exit;
            }
        }
        
        $response['success'] = true;
        $response['message'] = 'Foto berhasil diupload dan disimpan';
        $response['uploadedFiles'] = $uploadedFiles;
        
        echo json_encode($response);
        
    } catch (Exception $e) {
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
                'success' => false,
                'message' => 'No data found'
            ));
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
