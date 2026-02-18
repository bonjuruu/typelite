/** Lazy-load html2canvas to keep it out of the main bundle. */
async function loadHtml2Canvas() {
  const { default: html2canvas } = await import('html2canvas')
  return html2canvas
}

/**
 * Render a DOM element to a canvas and trigger a PNG download.
 */
export async function exportCardAsImage(element: HTMLElement, fileName: string): Promise<void> {
  const html2canvas = await loadHtml2Canvas()
  const canvas = await html2canvas(element, {
    backgroundColor: '#0a0a1a',
    scale: 2, // 2x for crisp retina output
    logging: false,
    useCORS: true,
  })

  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = `${fileName}.png`
  link.href = dataUrl
  link.click()
}

/**
 * Render a DOM element to a canvas and copy the image to clipboard.
 * Falls back to download if clipboard API is unavailable.
 */
export async function copyCardToClipboard(element: HTMLElement, fileName: string): Promise<boolean> {
  const html2canvas = await loadHtml2Canvas()
  const canvas = await html2canvas(element, {
    backgroundColor: '#0a0a1a',
    scale: 2,
    logging: false,
    useCORS: true,
  })

  try {
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b)
        else reject(new Error('Failed to create blob'))
      }, 'image/png')
    })

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ])
    return true
  } catch {
    // Fallback to download if clipboard isn't available
    await exportCardAsImage(element, fileName)
    return false
  }
}
