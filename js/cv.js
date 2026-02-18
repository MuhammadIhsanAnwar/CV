function downloadPDF() {
  console.log("[DOWNLOAD] Generating PDF using jsPDF...");

  // Check if libraries are loaded
  if (typeof html2canvas === "undefined") {
    console.error("[ERROR] html2canvas not found on window:", window.html2canvas);
    alert("Error: html2canvas library not loaded. Please check your internet connection.");
    return;
  }

  // jsPDF is available as window.jsPDF
  if (!window.jsPDF) {
    console.error("[ERROR] jsPDF not found on window. Available on window:", Object.keys(window).filter(k => k.toLowerCase().includes('pdf')));
    alert("Error: jsPDF library not loaded. Please check your internet connection.");
    return;
  }

  const element = document.querySelector(".container");

  if (!element) {
    console.error("[ERROR] CV content not found");
    alert("Error: CV content not found");
    return;
  }

  // Get the element and convert to canvas
  html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: true,
    backgroundColor: "#ffffff",
  })
    .then((canvas) => {
      const jsPDF = window.jsPDF.jsPDF || window.jsPDF;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      // Save the PDF
      const filename = "CV_Muhammad_Ihsan_Anwar.pdf";
      pdf.save(filename);
      console.log("[OK] PDF download started!");
    })
    .catch((error) => {
      console.error("[ERROR] PDF generation failed:", error);
      alert("PDF generation failed: " + error.message);
    });
}
