function downloadPDF() {
  console.log("[DOWNLOAD] Generating PDF using FPDF...");

  const apiUrl = "https://neoverse.my.id/api/generate-cv-pdf.php";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
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
      console.warn("[INFO] Attempting fallback: Opening PDF in new tab...");
      window.open(apiUrl, "_blank");
    });
}
