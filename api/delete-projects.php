<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: DELETE, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'koneksi.php';

try {
    // Get JSON from request body
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data || empty($data['id'])) {
        throw new Exception("Project ID is required");
    }

    $id = intval($data['id']);

    // Delete project
    $query = "DELETE FROM projects WHERE id = $id";

    if (mysqli_query($koneksi, $query)) {
        if (mysqli_affected_rows($koneksi) > 0) {
            echo json_encode(array(
                'success' => true,
                'message' => 'Project deleted successfully'
            ));
        } else {
            throw new Exception("Project not found");
        }
    } else {
        throw new Exception("Query error: " . mysqli_error($koneksi));
    }

    mysqli_close($koneksi);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array(
        'success' => false,
        'error' => $e->getMessage()
    ));
}
