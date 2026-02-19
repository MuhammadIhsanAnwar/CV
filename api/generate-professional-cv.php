<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if FPDF exists
$fpdfPaths = [
    __DIR__ . '/../neoverse.my.id/library/fpdf.php',  // public_html/api -> public_html/neoverse.my.id/library
    __DIR__ . '/../library/fpdf.php',
    __DIR__ . '/../../library/fpdf.php',
    $_SERVER['DOCUMENT_ROOT'] . '/neoverse.my.id/library/fpdf.php',
    $_SERVER['DOCUMENT_ROOT'] . '/library/fpdf.php',
    dirname(dirname(__FILE__)) . '/library/fpdf.php'
];

$fpdfPath = null;
foreach ($fpdfPaths as $path) {
    if (file_exists($path)) {
        $fpdfPath = $path;
        break;
    }
}

if (!$fpdfPath) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'FPDF library not found',
        'tried_paths' => $fpdfPaths,
        'current_dir' => __DIR__
    ]);
    exit;
}

require_once($fpdfPath);

// Custom PDF class for professional CV
class ProfessionalCV extends FPDF {
    private $primaryColor = array(0, 102, 204);     // Blue
    private $secondaryColor = array(51, 51, 51);    // Dark gray
    private $lightColor = array(240, 240, 240);     // Light gray
    
    function Header() {
        // No header needed, will be custom
    }
    
    function Footer() {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->SetTextColor(128, 128, 128);
        $this->Cell(0, 10, 'Halaman ' . $this->PageNo(), 0, 0, 'C');
    }
    
    function ColoredRect($x, $y, $w, $h, $r, $g, $b) {
        $this->SetFillColor($r, $g, $b);
        $this->Rect($x, $y, $w, $h, 'F');
    }
    
    function SectionTitle($title, $fullWidth = false) {
        $this->SetFont('Arial', 'B', 13);
        $this->SetTextColor($this->primaryColor[0], $this->primaryColor[1], $this->primaryColor[2]);
        $this->Cell(0, 8, strtoupper($title), 0, 1);
        
        // Underline
        $this->SetDrawColor($this->primaryColor[0], $this->primaryColor[1], $this->primaryColor[2]);
        $this->SetLineWidth(0.5);
        $lineWidth = $fullWidth ? 125 : 50;
        $this->Line($this->GetX(), $this->GetY(), $this->GetX() + $lineWidth, $this->GetY());
        $this->Ln(3);
    }
    
    function BulletList($items) {
        $this->SetFont('Arial', '', 10);
        $this->SetTextColor(0, 0, 0);
        
        if (!empty($items) && is_array($items)) {
            foreach ($items as $item) {
                if (!empty($item)) {
                    $this->Cell(5, 6, chr(149), 0, 0); // Bullet point
                    $x = $this->GetX();
                    $y = $this->GetY();
                    $this->MultiCell(0, 6, $item);
                    $this->SetXY($x - 5, $this->GetY());
                }
            }
        }
        $this->Ln(2);
    }
}

// Fetch data from database
$profileData = array(
    'name' => 'Nama Lengkap',
    'job' => 'Posisi / Jabatan',
    'email' => 'email@example.com',
    'phone' => '+62 812-3456-7890',
    'location' => 'Indonesia',
    'bio' => 'Bio singkat tentang diri Anda.',
    'about' => 'Deskripsi lengkap tentang diri Anda, pengalaman, dan tujuan karir.',
    'education' => array('Pendidikan 1', 'Pendidikan 2'),
    'skills' => array('Skill 1', 'Skill 2', 'Skill 3'),
    'experience' => array('Pengalaman 1', 'Pengalaman 2'),
    'achievement' => array('Prestasi 1', 'Prestasi 2')
);

$profilePhoto = null;

try {
    require_once(__DIR__ . '/koneksi.php');
    
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
        
        // Parse JSON arrays
        if (!empty($row['education'])) {
            $educationArray = json_decode($row['education'], true);
            if (is_array($educationArray)) $profileData['education'] = $educationArray;
        }
        if (!empty($row['skills'])) {
            $skillsArray = json_decode($row['skills'], true);
            if (is_array($skillsArray)) $profileData['skills'] = $skillsArray;
        }
        if (!empty($row['experience'])) {
            $experienceArray = json_decode($row['experience'], true);
            if (is_array($experienceArray)) $profileData['experience'] = $experienceArray;
        }
        if (!empty($row['achievement'])) {
            $achievementArray = json_decode($row['achievement'], true);
            if (is_array($achievementArray)) $profileData['achievement'] = $achievementArray;
        }
    }
    
    // Get profile photo from database
    $resultPhoto = $koneksi->query("SELECT foto1, foto2, foto3 FROM photos LIMIT 1");
    if ($resultPhoto && $resultPhoto->num_rows > 0) {
        $photoRow = $resultPhoto->fetch_assoc();
        
        // Check multiple possible photo paths
        $photoPaths = [
            __DIR__ . '/../neoverse.my.id/foto/',  // public_html/api -> public_html/neoverse.my.id/foto
            __DIR__ . '/../foto/'
        ];
        
        foreach (['foto1', 'foto2', 'foto3'] as $field) {
            if (!empty($photoRow[$field])) {
                foreach ($photoPaths as $photoPath) {
                    $testPath = $photoPath . $photoRow[$field];
                    if (file_exists($testPath)) {
                        $profilePhoto = $testPath;
                        break 2;  // Break both loops
                    }
                }
            }
        }
    }
} catch (Exception $e) {
    error_log("Database error: " . $e->getMessage());
}

try {
    $pdf = new ProfessionalCV();
    $pdf->AddPage();
    $pdf->SetMargins(15, 15, 15);
    $pdf->SetAutoPageBreak(true, 20);
    
    // ===== SIDEBAR (Left 60mm) =====
    $sidebarWidth = 60;
    $sidebarX = 15;
    $mainX = $sidebarX + $sidebarWidth + 5;
    
    // Sidebar background
    $pdf->ColoredRect($sidebarX, 15, $sidebarWidth, 267, 245, 247, 250);
    
    $pdf->SetXY($sidebarX, 20);
    
    // Profile Photo
    if ($profilePhoto && file_exists($profilePhoto)) {
        try {
            $imageExt = strtoupper(pathinfo($profilePhoto, PATHINFO_EXTENSION));
            if ($imageExt === 'JPG') $imageExt = 'JPEG';
            
            if (in_array($imageExt, ['PNG', 'JPEG', 'GIF'])) {
                // Center photo in sidebar
                $photoSize = 45;
                $photoX = $sidebarX + ($sidebarWidth - $photoSize) / 2;
                $pdf->Image($profilePhoto, $photoX, 23, $photoSize, $photoSize, $imageExt);
                $pdf->SetY(73);
            }
        } catch (Exception $e) {
            error_log("Photo error: " . $e->getMessage());
        }
    } else {
        // Placeholder - skip, will be replaced by initials or icon text
        $pdf->SetY(73);
    }
    
    $pdf->SetX($sidebarX + 3);
    
    // === CONTACT INFO ===
    $pdf->SetFont('Arial', 'B', 11);
    $pdf->SetTextColor(0, 102, 204);
    $pdf->Cell($sidebarWidth - 6, 7, 'KONTAK', 0, 1);
    $pdf->SetX($sidebarX + 3);
    $pdf->SetLineWidth(0.3);
    $pdf->SetDrawColor(0, 102, 204);
    $pdf->Line($sidebarX + 3, $pdf->GetY(), $sidebarX + 30, $pdf->GetY());
    $pdf->Ln(3);
    
    $pdf->SetFont('Arial', '', 8);
    $pdf->SetTextColor(50, 50, 50);
    
    // Email
    $pdf->SetX($sidebarX + 3);
    $pdf->SetFont('Arial', 'B', 8);
    $pdf->Cell($sidebarWidth - 6, 5, 'Email', 0, 1);
    $pdf->SetX($sidebarX + 3);
    $pdf->SetFont('Arial', '', 8);
    $pdf->MultiCell($sidebarWidth - 6, 4, $profileData['email']);
    $pdf->Ln(1);
    
    // Phone
    $pdf->SetX($sidebarX + 3);
    $pdf->SetFont('Arial', 'B', 8);
    $pdf->Cell($sidebarWidth - 6, 5, 'Telepon', 0, 1);
    $pdf->SetX($sidebarX + 3);
    $pdf->SetFont('Arial', '', 8);
    $pdf->MultiCell($sidebarWidth - 6, 4, $profileData['phone']);
    $pdf->Ln(1);
    
    // Location
    $pdf->SetX($sidebarX + 3);
    $pdf->SetFont('Arial', 'B', 8);
    $pdf->Cell($sidebarWidth - 6, 5, 'Lokasi', 0, 1);
    $pdf->SetX($sidebarX + 3);
    $pdf->SetFont('Arial', '', 8);
    $pdf->MultiCell($sidebarWidth - 6, 4, $profileData['location']);
    $pdf->Ln(3);
    
    // === SKILLS ===
    $pdf->SetX($sidebarX + 3);
    $pdf->SetFont('Arial', 'B', 11);
    $pdf->SetTextColor(0, 102, 204);
    $pdf->Cell($sidebarWidth - 6, 7, 'KEAHLIAN', 0, 1);
    $pdf->SetX($sidebarX + 3);
    $pdf->Line($sidebarX + 3, $pdf->GetY(), $sidebarX + 30, $pdf->GetY());
    $pdf->Ln(3);
    
    $pdf->SetFont('Arial', '', 9);
    $pdf->SetTextColor(0, 0, 0);
    
    if (!empty($profileData['skills']) && is_array($profileData['skills'])) {
        foreach ($profileData['skills'] as $skill) {
            if (!empty($skill)) {
                $pdf->SetX($sidebarX + 3);
                $pdf->Cell(5, 5, chr(149), 0, 0);
                $pdf->MultiCell($sidebarWidth - 9, 5, $skill);
            }
        }
    }
    
    // ===== MAIN CONTENT (Right side) =====
    $pdf->SetXY($mainX, 20);
    
    // Name and Title
    $pdf->SetFont('Arial', 'B', 22);
    $pdf->SetTextColor(0, 102, 204);
    $pdf->MultiCell(0, 10, strtoupper($profileData['name']));
    
    $pdf->SetX($mainX);
    $pdf->SetFont('Arial', 'I', 12);
    $pdf->SetTextColor(100, 100, 100);
    $pdf->Cell(0, 6, $profileData['job'], 0, 1);
    $pdf->Ln(2);
    
    // Separator line
    $pdf->SetX($mainX);
    $pdf->SetDrawColor(0, 102, 204);
    $pdf->SetLineWidth(0.8);
    $pdf->Line($mainX, $pdf->GetY(), $mainX + 125, $pdf->GetY());
    $pdf->Ln(5);
    
    // === PROFILE / BIO ===
    $pdf->SetX($mainX);
    $pdf->SectionTitle('Profil');
    
    $pdf->SetX($mainX);
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetTextColor(0, 0, 0);
    $pdf->MultiCell(0, 5, $profileData['bio']);
    $pdf->Ln(3);
    
    // === ABOUT ===
    $pdf->SetX($mainX);
    $pdf->SectionTitle('Tentang Saya');
    
    $pdf->SetX($mainX);
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetTextColor(0, 0, 0);
    $pdf->MultiCell(0, 5, $profileData['about']);
    $pdf->Ln(3);
    
    // === EDUCATION ===
    $pdf->SetX($mainX);
    $pdf->SectionTitle('Pendidikan');
    
    $pdf->SetX($mainX);
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetTextColor(0, 0, 0);
    
    if (!empty($profileData['education']) && is_array($profileData['education'])) {
        foreach ($profileData['education'] as $edu) {
            if (!empty($edu)) {
                $pdf->SetX($mainX);
                $pdf->Cell(5, 6, chr(149), 0, 0);
                $pdf->MultiCell(0, 6, $edu);
            }
        }
    }
    $pdf->Ln(2);
    
    // === EXPERIENCE ===
    $pdf->SetX($mainX);
    $pdf->SectionTitle('Pengalaman Organisasi');
    
    $pdf->SetX($mainX);
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetTextColor(0, 0, 0);
    
    if (!empty($profileData['experience']) && is_array($profileData['experience'])) {
        foreach ($profileData['experience'] as $exp) {
            if (!empty($exp)) {
                $pdf->SetX($mainX);
                $pdf->Cell(5, 6, chr(149), 0, 0);
                $pdf->MultiCell(0, 6, $exp);
            }
        }
    }
    $pdf->Ln(2);
    
    // === ACHIEVEMENT ===
    $pdf->SetX($mainX);
    $pdf->SectionTitle('Prestasi');
    
    $pdf->SetX($mainX);
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetTextColor(0, 0, 0);
    
    if (!empty($profileData['achievement']) && is_array($profileData['achievement'])) {
        foreach ($profileData['achievement'] as $ach) {
            if (!empty($ach)) {
                $pdf->SetX($mainX);
                $pdf->Cell(5, 6, chr(149), 0, 0);
                $pdf->MultiCell(0, 6, $ach);
            }
        }
    }
    
    // Generate filename
    $filename = 'CV_' . str_replace(' ', '_', $profileData['name']) . '_' . date('Y') . '.pdf';
    
    // Output PDF
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Pragma: no-cache');
    header('Expires: 0');
    
    $pdf->Output('D', $filename);
    exit;
    
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'PDF generation failed: ' . $e->getMessage()]);
    exit;
}
