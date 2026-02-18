function downloadPDF() {
  console.log("[DOWNLOAD] Generating PDF using FPDF...");

  const apiUrl = "../api/generate-cv-pdf.php";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        // Try to parse error response
        return response.text().then((text) => {
          try {
            const error = JSON.parse(text);
            throw new Error(`HTTP ${response.status}: ${error.error}`);
          } catch {
            throw new Error(`HTTP Error: ${response.status}`);
          }
        });
      }
      return response.blob();
    })
    .then((blob) => {
      // Check if blob is actually a PDF
      if (blob.type !== 'application/pdf') {
        throw new Error('Invalid response: received ' + blob.type + ' instead of PDF');
      }
      
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "CV_Muhammad_Ihsan_Anwar.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      console.log("[OK] PDF download started!");
    })
    .catch((error) => {
      console.error("[ERROR] PDF download failed:", error.message);
      alert("PDF download failed: " + error.message);
    });
}
