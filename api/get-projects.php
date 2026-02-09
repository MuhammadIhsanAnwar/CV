<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'koneksi.php';

try {
    // Query to get all projects sorted by display_order
    $query = "SELECT * FROM projects ORDER BY display_order ASC";
    $result = mysqli_query($koneksi, $query);
    
    if (!$result) {
        throw new Exception("Query error: " . mysqli_error($koneksi));
    }
    
    $projects = array();
    
    while ($row = mysqli_fetch_assoc($result)) {
        // Decode JSON fields
        $row['tech_stack'] = !empty($row['tech_stack']) ? json_decode($row['tech_stack'], true) : array();
        $projects[] = $row;
    }
    
    echo json_encode(array(
        'success' => true,
        'data' => $projects,
        'message' => 'Projects retrieved successfully'
    ));
    
    mysqli_close($koneksi);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        'success' => false,
        'error' => $e->getMessage()
    ));
}
?>
