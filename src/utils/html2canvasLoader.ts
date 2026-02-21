import type html2canvasType from "html2canvas";

/** Lazy-load html2canvas to keep it out of the main bundle. */
export async function loadHtml2Canvas(): Promise<typeof html2canvasType> {
  const { default: html2canvas } = await import("html2canvas");
  return html2canvas;
}
