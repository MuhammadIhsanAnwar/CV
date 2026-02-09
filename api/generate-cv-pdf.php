<?php
// Load FPDF library
require_once('../library/fpdf.php');

// Fetch data from API
$profileData = null;
try {
  $response = file_get_contents('../api/get-profile.php');
  $profileData = json_decode($response, true);
} catch (Exception $e) {
  $profileData = array(
    'name' => 'Muhammad Ihsan Anwar',
    'job' => 'Web Developer / UI Designer',
    'email' => 'muhammadihsananwar3@gmail.com',
    'phone' => '085279788815',
    'location' => 'Medan, Indonesia',
    'bio' => 'Saya adalah seorang pengembang web yang tertarik pada UI futuristik, teknologi modern, dan pengalaman pengguna.',
    'about' => 'Saya memiliki passion untuk menciptakan website yang tidak hanya berfungsi dengan baik tetapi juga menarik secara visual.',
    'education' => array('S1 Teknologi Informasi – Universitas Sumatera Utara (2025 - Sekarang)', 'SMA Negeri Asahan (2022 - 2025)'),
    'skills' => array('HTML, CSS, JavaScript', 'UI/UX Design', 'Git & GitHub', 'Responsive Web Design'),
    'experience' => array('Junior Web Developer – Contoh Perusahaan (2024 - Sekarang)', 'Freelance UI Designer (2023 - 2024)'),
    'achievement' => array('Pemenang Kompetisi Web Design (2024)', 'Best UI/UX Developer Award (2023)')
  );
}

// Create PDF
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial', '', 11);

// Title
$pdf->SetFont('Arial', 'B', 18);
$pdf->SetTextColor(0, 102, 204);
$pdf->Cell(0, 10, 'CURRICULUM VITAE', 0, 1, 'C');
$pdf->SetLineWidth(0.5);
$pdf->Line(10, $pdf->GetY() + 2, 200, $pdf->GetY() + 2);
$pdf->Ln(8);

// Name
$pdf->SetFont('Arial', 'B', 14);
$pdf->SetTextColor(0, 0, 0);
$pdf->Cell(0, 8, $profileData['name'], 0, 1);

// Position
$pdf->SetFont('Arial', 'I', 11);
$pdf->SetTextColor(102, 102, 102);
$pdf->Cell(0, 6, $profileData['job'], 0, 1);
$pdf->Ln(3);

// Contact Info
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(30, 5, 'Email:', 0, 0);
$pdf->Cell(0, 5, $profileData['email'], 0, 1);
$pdf->Cell(30, 5, 'Telepon:', 0, 0);
$pdf->Cell(0, 5, $profileData['phone'], 0, 1);
$pdf->Cell(30, 5, 'Lokasi:', 0, 0);
$pdf->Cell(0, 5, $profileData['location'], 0, 1);
$pdf->Ln(3);

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
foreach ($profileData['education'] as $edu) {
  $pdf->Cell(5, 5, '• ', 0, 0);
  $pdf->MultiCell(0, 5, $edu);
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
foreach ($profileData['skills'] as $skill) {
  $pdf->Cell(5, 5, '• ', 0, 0);
  $pdf->MultiCell(0, 5, $skill);
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
foreach ($profileData['experience'] as $exp) {
  $pdf->Cell(5, 5, '• ', 0, 0);
  $pdf->MultiCell(0, 5, $exp);
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
foreach ($profileData['achievement'] as $ach) {
  $pdf->Cell(5, 5, '• ', 0, 0);
  $pdf->MultiCell(0, 5, $ach);
}

// Set filename
$filename = 'CV_' . str_replace(' ', '_', $profileData['name']) . '_' . date('Y') . '.pdf';

// Output PDF
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $filename . '"');
$pdf->Output('D', $filename);
exit;
?>
