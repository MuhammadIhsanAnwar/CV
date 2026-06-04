<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// ===== DIAGNOSA STRUKTUR PATH =====
$paths_debug = [
    '__FILE__' => __FILE__,
    '__DIR__' => __DIR__,
    'dirname(__DIR__)' => dirname(__DIR__),
    'dirname(dirname(__DIR__))' => dirname(dirname(__DIR__)),
    'dirname(dirname(dirname(__DIR__)))' => dirname(dirname(dirname(__DIR__))),
    'DOCUMENT_ROOT' => $_SERVER['DOCUMENT_ROOT'] ?? 'NOT SET',
];

// ===== KANDIDAT PATH UPLOAD =====
$candidates = [
    'Method_1: dirname(dirname(__DIR__))/foto_proyek/' => dirname(dirname(__DIR__)) . '/foto_proyek/',
    'Method_2: DOCUMENT_ROOT/neoverse.my.id/CV/foto_proyek/' => $_SERVER['DOCUMENT_ROOT'] . '/neoverse.my.id/CV/foto_proyek/',
    'Method_3: DOCUMENT_ROOT/CV/foto_proyek/' => $_SERVER['DOCUMENT_ROOT'] . '/CV/foto_proyek/',
    'Method_4: dirname(dirname(dirname(__DIR__)))/CV/foto_proyek/' => dirname(dirname(dirname(__DIR__))) . '/CV/foto_proyek/',
    'Method_5: dirname(dirname(dirname(__DIR__)))/neoverse.my.id/CV/foto_proyek/' => dirname(dirname(dirname(__DIR__))) . '/neoverse.my.id/CV/foto_proyek/',
];

// ===== CEK STATUS FOLDER =====
$folder_status = [];
foreach ($candidates as $method => $path) {
    $folder_status[$method] = [
        'path' => $path,
        'exists' => is_dir($path),
        'is_writable' => is_writable($path),
        'parent_exists' => is_dir(dirname($path)),
        'permissions' => is_dir($path) ? substr(sprintf('%o', fileperms($path)), -4) : 'N/A'
    ];
}

// ===== CEK FILE YANG SUDAH ADA =====
$files_found = [];
foreach ($candidates as $method => $path) {
    if (is_dir($path)) {
        $files = @scandir($path);
        if ($files) {
            foreach ($files as $file) {
                if (strpos($file, 'foto_proyek_') === 0) {
                    $files_found[] = [
                        'location' => $path,
                        'filename' => $file,
                        'size' => filesize($path . $file),
                        'created' => date('Y-m-d H:i:s', filemtime($path . $file))
                    ];
                }
            }
        }
    }
}

// ===== RESPONSE =====
$response = [
    'paths_absolute' => $paths_debug,
    'candidates_to_check' => $candidates,
    'folder_analysis' => $folder_status,
    'existing_files' => !empty($files_found) ? $files_found : 'No foto_proyek_* files found',
    'recommendation' => 'Lihat folder_analysis mana yang exists=true dan is_writable=true, itu folder yang seharusnya digunakan'
];

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
