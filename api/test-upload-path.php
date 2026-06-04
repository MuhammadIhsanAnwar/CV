<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Analisis path di upload-project-photo.php seharusnya
$script_info = [
    'script_path' => __FILE__,
    'script_dir' => __DIR__,
    'dirname(__DIR__)' => dirname(__DIR__),
    'dirname(dirname(__DIR__))' => dirname(dirname(__DIR__)),
];

// Simulasi path yang akan dihasilkan di upload-project-photo.php
$scenarios = [
    'Jika dirname(dirname(__DIR__))/foto_proyek/' => dirname(dirname(__DIR__)) . '/foto_proyek/',
    'Jika DOCUMENT_ROOT/neoverse.my.id/foto_proyek/' => $_SERVER['DOCUMENT_ROOT'] . '/neoverse.my.id/foto_proyek/',
];

// Status masing-masing
$status = [];
foreach ($scenarios as $desc => $path) {
    $status[$desc] = [
        'path' => $path,
        'exists' => is_dir($path),
        'writable' => is_writable($path),
        'files_count' => is_dir($path) ? count(glob($path . 'foto_proyek_*')) : 0
    ];
}

// Cek file di semua lokasi
$all_files = [];
$search_paths = [
    '/home/neoz6813/foto_proyek/',
    '/home/neoz6813/public_html/neoverse.my.id/foto_proyek/',
    dirname(dirname(__DIR__)) . '/foto_proyek/'
];

foreach ($search_paths as $path) {
    if (is_dir($path)) {
        $files = glob($path . 'foto_proyek_*');
        if ($files) {
            $all_files[$path] = count($files) . ' files';
        }
    }
}

$response = [
    'current_script' => $script_info,
    'scenarios' => $status,
    'files_found_in' => !empty($all_files) ? $all_files : 'No foto_proyek_* files found anywhere'
];

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
