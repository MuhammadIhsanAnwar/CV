<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

    if (!$data) {
        throw new Exception("Invalid JSON format");
    }

    // Validate required fields
    if (empty($data['title']) || empty($data['github_link'])) {
        throw new Exception("Title and GitHub link are required");
    }

    // Escape data
    $id = isset($data['id']) ? intval($data['id']) : 0;
    $icon = mysqli_real_escape_string($koneksi, $data['icon'] ?? 'fas fa-code');
    $title = mysqli_real_escape_string($koneksi, $data['title']);
    $description = mysqli_real_escape_string($koneksi, $data['description'] ?? '');
    $tech_stack = json_encode($data['tech_stack'] ?? array());
    $demo_link = !empty($data['demo_link']) ? mysqli_real_escape_string($koneksi, $data['demo_link']) : NULL;
    $github_link = mysqli_real_escape_string($koneksi, $data['github_link']);
    $display_order = intval($data['display_order'] ?? 0);

    // Check if project exists (for update)
    if ($id > 0) {
        $query = "UPDATE projects SET 
                  icon = '$icon',
                  title = '$title',
                  description = '$description',
                  tech_stack = '$tech_stack',
                  demo_link = " . ($demo_link ? "'$demo_link'" : "NULL") . ",
                  github_link = '$github_link',
                  display_order = $display_order,
                  updated_at = NOW()
                  WHERE id = $id";
    } else {
        // Insert new project
        $query = "INSERT INTO projects (icon, title, description, tech_stack, demo_link, github_link, display_order) 
                  VALUES ('$icon', '$title', '$description', '$tech_stack', " . ($demo_link ? "'$demo_link'" : "NULL") . ", '$github_link', $display_order)";
    }

    if (mysqli_query($koneksi, $query)) {
        $last_id = $id > 0 ? $id : mysqli_insert_id($koneksi);

        echo json_encode(array(
            'success' => true,
            'id' => $last_id,
            'message' => $id > 0 ? 'Project updated successfully' : 'Project created successfully'
        ));
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
