<?php
// Start output buffering to catch any errors
ob_start();

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Enable CORS for GitHub Pages cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if FPDF library exists
if (!file_exists(__DIR__ . '/../library/fpdf.php')) {
    ob_end_clean();
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'FPDF library not found']);
    exit;
}

// Load FPDF library
require_once(__DIR__ . '/../library/fpdf.php');

// Define default profile data
$profileData = array(
    'name' => 'Muhammad Ihsan Anwar',
    'job' => 'Web Developer / UI Designer',
    'email' => 'muhammadihsananwar3@gmail.com',
    'phone' => '085279788815',
    'location' => 'Medan, Indonesia',
    'bio' => 'Saya adalah seorang pengembang web yang tertarik pada UI futuristik, teknologi modern, dan pengalaman pengguna.',
    'about' => 'Saya memiliki passion untuk menciptakan website yang tidak hanya berfungsi dengan baik tetapi juga menarik secara visual.',
    'education' => array(
        'S1 Teknologi Informasi – Universitas Sumatera Utara (2025 - Sekarang)',
        'SMA Negeri Asahan (2022 - 2025)'
    ),
    'skills' => array(
        'HTML, CSS, JavaScript',
        'UI/UX Design',
        'Git & GitHub',
        'Responsive Web Design'
    ),
    'experience' => array(
        'Junior Web Developer – Contoh Perusahaan (2024 - Sekarang)',
        'Freelance UI Designer (2023 - 2024)'
    ),
    'achievement' => array(
        'Pemenang Kompetisi Web Design (2024)',
        'Best UI/UX Developer Award (2023)'
    )
);

// Initialize variables
$result = null;
$row = null;

// Try to fetch fresh data from database if connection exists
try {
    require_once(__DIR__ . '/koneksi.php');
    
    // Query data from database
    $result = $koneksi->query("SELECT * FROM profile LIMIT 1");
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $profileData['name'] = !empty($row['name']) ? $row['name'] : $profileData['name'];
        $profileData['job'] = !empty($row['job']) ? $row['job'] : $profileData['job'];
        $profileData['email'] = !empty($row['email']) ? $row['email'] : $profileData['email'];
        $profileData['phone'] = !empty($row['phone']) ? $row['phone'] : $profileData['phone'];
        $profileData['location'] = !empty($row['location']) ? $row['location'] : $profileData['location'];
        $profileData['bio'] = !empty($row['bio']) ? $row['bio'] : $profileData['bio'];
        $profileData['about'] = !empty($row['about']) ? $row['about'] : $profileData['about'];
        
        // Parse JSON fields for arrays
        if (!empty($row['education'])) {
            $educationArray = json_decode($row['education'], true);
            if (is_array($educationArray)) {
                $profileData['education'] = $educationArray;
            }
        }
        if (!empty($row['skills'])) {
            $skillsArray = json_decode($row['skills'], true);
            if (is_array($skillsArray)) {
                $profileData['skills'] = $skillsArray;
            }
        }
        if (!empty($row['experience'])) {
            $experienceArray = json_decode($row['experience'], true);
            if (is_array($experienceArray)) {
                $profileData['experience'] = $experienceArray;
            }
        }
        if (!empty($row['achievement'])) {
            $achievementArray = json_decode($row['achievement'], true);
            if (is_array($achievementArray)) {
                $profileData['achievement'] = $achievementArray;
            }
        }
    }
} catch (Exception $e) {
    // Use default data if database fails
    error_log("PDF generation using fallback data: " . $e->getMessage());
}

// Try to generate PDF
try {
    // Create PDF
    $pdf = new FPDF();
    $pdf->AddPage();
    $pdf->SetFont('Arial', '', 11);

// Add profile photo at the top (if exists)
$photoPath = __DIR__ . '/../foto/';
$profilePhoto = null;

// Try to find first available profile photo
$photoField = ['foto1', 'foto2', 'foto3'];
if ($result && $result->num_rows > 0) {
    foreach ($photoField as $field) {
        if (!empty($row[$field])) {
            $testPath = $photoPath . $row[$field];
            if (file_exists($testPath)) {
                $profilePhoto = $testPath;
                break;
            }
        }
    }
}

// Add name and photo in header
$startY = $pdf->GetY();
$pdf->SetFont('Arial', 'B', 18);
$pdf->SetTextColor(0, 102, 204);

// Add photo if available
if ($profilePhoto) {
    $pdf->Image($profilePhoto, 10, $startY, 30, 30, 'PNG');
    $pdf->SetXY(45, $startY);
    $pdf->MultiCell(0, 8, $profileData['name']);
} else {
    $pdf->Cell(0, 10, $profileData['name'], 0, 1, 'C');
}

$pdf->SetXY(45, $startY + 15);
$pdf->SetFont('Arial', 'I', 11);
$pdf->SetTextColor(102, 102, 102);
$pdf->Cell(0, 6, $profileData['job'], 0, 1);
$pdf->SetXY(45, $startY + 22);
$pdf->SetFont('Arial', '', 9);
$pdf->SetTextColor(0, 0, 0);
$pdf->MultiCell(0, 4, $profileData['email'] . ' | ' . $profileData['phone'] . ' | ' . $profileData['location']);

$pdf->SetY($startY + 40);
$pdf->SetLineWidth(0.5);
$pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
$pdf->Ln(5);

// Bio
$pdf->SetFont('Arial', '', 10);
$pdf->MultiCell(0, 5, $profileData['bio']);
$pdf->Ln(2);

// Section: About
$pdf->SetFont('Arial', 'B', 11);
$pdf->SetTextColor(0, 102, 204);
$pdf->Cell(0, 7, 'TENTANG SAYA', 0, 1);
$pdf->SetLineWidth(0.3);
$pdf->Line(10, $pdf->GetY(), 70, $pdf->GetY());
$pdf->Ln(2);

$pdf->SetFont('Arial', '', 10);
$pdf->SetTextColor(0, 0, 0);
$pdf->MultiCell(0, 5, $profileData['about']);
$pdf->Ln(2);

// Section: Education
$pdf->SetFont('Arial', 'B', 11);
$pdf->SetTextColor(0, 102, 204);
$pdf->Cell(0, 7, 'PENDIDIKAN', 0, 1);
$pdf->SetLineWidth(0.3);
$pdf->Line(10, $pdf->GetY(), 70, $pdf->GetY());
$pdf->Ln(2);

$pdf->SetFont('Arial', '', 10);
$pdf->SetTextColor(0, 0, 0);
if (!empty($profileData['education']) && is_array($profileData['education'])) {
    foreach ($profileData['education'] as $edu) {
        if (!empty($edu)) {
            $pdf->Cell(5, 5, '- ', 0, 0);
            $pdf->MultiCell(0, 5, $edu);
        }
    }
}
$pdf->Ln(1);

// Section: Skills
$pdf->SetFont('Arial', 'B', 11);
$pdf->SetTextColor(0, 102, 204);
$pdf->Cell(0, 7, 'KEAHLIAN', 0, 1);
$pdf->SetLineWidth(0.3);
$pdf->Line(10, $pdf->GetY(), 70, $pdf->GetY());
$pdf->Ln(2);

$pdf->SetFont('Arial', '', 10);
$pdf->SetTextColor(0, 0, 0);
if (!empty($profileData['skills']) && is_array($profileData['skills'])) {
    foreach ($profileData['skills'] as $skill) {
        if (!empty($skill)) {
            $pdf->Cell(5, 5, '- ', 0, 0);
            $pdf->MultiCell(0, 5, $skill);
        }
    }
}
$pdf->Ln(1);

// Section: Experience
$pdf->SetFont('Arial', 'B', 11);
$pdf->SetTextColor(0, 102, 204);
$pdf->Cell(0, 7, 'PENGALAMAN ORGANISASI', 0, 1);
$pdf->SetLineWidth(0.3);
$pdf->Line(10, $pdf->GetY(), 100, $pdf->GetY());
$pdf->Ln(2);

$pdf->SetFont('Arial', '', 10);
$pdf->SetTextColor(0, 0, 0);
if (!empty($profileData['experience']) && is_array($profileData['experience'])) {
    foreach ($profileData['experience'] as $exp) {
        if (!empty($exp)) {
            $pdf->Cell(5, 5, '- ', 0, 0);
            $pdf->MultiCell(0, 5, $exp);
        }
    }
}
$pdf->Ln(1);

// Section: Achievement
$pdf->SetFont('Arial', 'B', 11);
$pdf->SetTextColor(0, 102, 204);
$pdf->Cell(0, 7, 'PRESTASI', 0, 1);
$pdf->SetLineWidth(0.3);
$pdf->Line(10, $pdf->GetY(), 60, $pdf->GetY());
$pdf->Ln(2);

$pdf->SetFont('Arial', '', 10);
$pdf->SetTextColor(0, 0, 0);
if (!empty($profileData['achievement']) && is_array($profileData['achievement'])) {
    foreach ($profileData['achievement'] as $ach) {
        if (!empty($ach)) {
            $pdf->Cell(5, 5, '- ', 0, 0);
            $pdf->MultiCell(0, 5, $ach);
        }
    }
}

// Set filename and output PDF
$filename = 'CV_' . str_replace(' ', '_', $profileData['name']) . '_' . date('Y') . '.pdf';

// Clear any buffered output before sending PDF headers
ob_end_clean();

header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Pragma: no-cache');
header('Expires: 0');

$pdf->Output('D', $filename);
exit;
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'PDF generation failed: ' . $e->getMessage()]);
    exit;
}
?>
