import { loadHtml2Canvas } from "./html2canvasLoader.ts";

/**
 * Render a DOM element to a canvas, slice it into A4 pages, and trigger a PDF download.
 */
export async function exportCharacterAsPdf(
  element: HTMLElement,
  fileName: string,
): Promise<void> {
  const [html2canvas, { jsPDF }] = await Promise.all([
    loadHtml2Canvas(),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(element, {
    backgroundColor: "#0a0a1a",
    scale: 2,
    logging: false,
    useCORS: true,
  });

  // A4 dimensions in mm
  const pageWidthMm = 210;
  const pageHeightMm = 297;

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Scale canvas width to fit A4 width
  const imgWidthMm = pageWidthMm;
  const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

  if (imgHeightMm <= pageHeightMm) {
    // Single page — fits entirely
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      imgWidthMm,
      imgHeightMm,
    );
  } else {
    // Multi-page — slice canvas into page-height chunks
    const pageHeightPx = (pageHeightMm / imgHeightMm) * canvas.height;
    let remainingHeight = canvas.height;
    let pageIndex = 0;

    while (remainingHeight > 0) {
      const sliceHeight = Math.min(pageHeightPx, remainingHeight);

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;

      const ctx = pageCanvas.getContext("2d")!;
      ctx.drawImage(
        canvas,
        0,
        pageIndex * pageHeightPx, // source x, y
        canvas.width,
        sliceHeight, // source width, height
        0,
        0, // dest x, y
        canvas.width,
        sliceHeight, // dest width, height
      );

      const sliceImgHeightMm = (sliceHeight * imgWidthMm) / canvas.width;

      if (pageIndex > 0) {
        pdf.addPage();
      }
      pdf.addImage(
        pageCanvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidthMm,
        sliceImgHeightMm,
      );

      remainingHeight -= sliceHeight;
      pageIndex++;
    }
  }

  pdf.save(`${fileName}.pdf`);
}
