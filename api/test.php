<?php
header('Content-Type: application/json');

$response = [
    'status' => 'ok',
    'message' => 'API endpoint is working',
    'script_dir' => __DIR__,
    'fpdf_exists' => file_exists(__DIR__ . '/../library/fpdf.php'),
    'foto_dir_exists' => is_dir(__DIR__ . '/../foto'),
    'php_version' => phpversion(),
    'current_time' => date('Y-m-d H:i:s')
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
