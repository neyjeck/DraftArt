/**
 * Applies 3x3 Sobel operator edge detection to an ImageData buffer.
 * Extracts clean anime character outlines and high-frequency details.
 */
export function applySobelEdgeDetection(
  srcImageData: ImageData,
  threshold: number = 75,
  invert: boolean = false
): ImageData {
  const { width, height, data } = srcImageData
  const output = new ImageData(width, height)
  const outData = output.data

  // Step 1: Create a 1D grayscale luminance buffer
  const gray = new Float32Array(width * height)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3] / 255
    // Standard perceptual luminance formula weighted with alpha
    gray[i / 4] = (0.299 * r + 0.587 * g + 0.114 * b) * a
  }

  // Sobel 3x3 convolution kernels
  // Gx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
  // Gy = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      // Sample 3x3 neighborhood
      const p00 = gray[(y - 1) * width + (x - 1)]
      const p01 = gray[(y - 1) * width + x]
      const p02 = gray[(y - 1) * width + (x + 1)]

      const p10 = gray[y * width + (x - 1)]
      const p12 = gray[y * width + (x + 1)]

      const p20 = gray[(y + 1) * width + (x - 1)]
      const p21 = gray[(y + 1) * width + x]
      const p22 = gray[(y + 1) * width + (x + 1)]

      // Compute horizontal and vertical gradients
      const gx = -p00 + p02 - 2 * p10 + 2 * p12 - p20 + p22
      const gy = -p00 - 2 * p01 - p02 + p20 + 2 * p21 + p22

      // Magnitude of edge gradient
      const magnitude = Math.hypot(gx, gy)

      // Apply threshold: if magnitude >= threshold, it's an edge (white dot / set pixel)
      let val = magnitude >= threshold ? 255 : 0
      if (invert) {
        val = 255 - val
      }

      const outIdx = (y * width + x) * 4
      outData[outIdx] = val
      outData[outIdx + 1] = val
      outData[outIdx + 2] = val
      outData[outIdx + 3] = 255
    }
  }

  return output
}
