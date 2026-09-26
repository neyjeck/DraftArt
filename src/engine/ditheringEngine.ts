import { DitherAlgorithm } from '@/types/layer'

/**
 * Applies spatial dithering or thresholding to convert an RGBA ImageData into a 1-bit binary dot matrix.
 * Returns a 1D Uint8Array of size (width * height), where 1 = dot ON, 0 = dot OFF.
 */
export function processImageToBinaryMatrix(
  srcImageData: ImageData,
  algorithm: DitherAlgorithm = 'atkinson',
  threshold: number = 128,
  invert: boolean = false
): Uint8Array {
  const { width, height, data } = srcImageData
  const totalPixels = width * height
  const output = new Uint8Array(totalPixels)

  // Buffer of floating point luminance values for error diffusion
  const lum = new Float32Array(totalPixels)

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3] / 255

    // Perceptual grayscale luminance
    let l = (0.299 * r + 0.587 * g + 0.114 * b) * a
    if (invert) {
      l = 255 - l
    }
    lum[i / 4] = l
  }

  // Pure Threshold (No error diffusion)
  if (algorithm === 'none') {
    for (let i = 0; i < totalPixels; i++) {
      output[i] = lum[i] >= threshold ? 1 : 0
    }
    return output
  }

  // Floyd-Steinberg Dithering
  if (algorithm === 'floyd-steinberg') {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x
        const oldPixel = lum[idx]
        const newPixel = oldPixel >= threshold ? 255 : 0
        output[idx] = newPixel === 255 ? 1 : 0

        const error = oldPixel - newPixel

        // Distribute error
        // Right: 7/16
        if (x + 1 < width) {
          lum[y * width + (x + 1)] += (error * 7) / 16
        }
        // Down-Left: 3/16
        if (x - 1 >= 0 && y + 1 < height) {
          lum[(y + 1) * width + (x - 1)] += (error * 3) / 16
        }
        // Down: 5/16
        if (y + 1 < height) {
          lum[(y + 1) * width + x] += (error * 5) / 16
        }
        // Down-Right: 1/16
        if (x + 1 < width && y + 1 < height) {
          lum[(y + 1) * width + (x + 1)] += (error * 1) / 16
        }
      }
    }
    return output
  }

  // Atkinson Dithering (Crisp outlines, popular for anime pixel art)
  if (algorithm === 'atkinson') {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x
        const oldPixel = lum[idx]
        const newPixel = oldPixel >= threshold ? 255 : 0
        output[idx] = newPixel === 255 ? 1 : 0

        // In Atkinson dithering, only 3/4 (6/8) of the error is diffused
        const errorPart = (oldPixel - newPixel) / 8

        // (x + 1, y)
        if (x + 1 < width) lum[y * width + (x + 1)] += errorPart
        // (x + 2, y)
        if (x + 2 < width) lum[y * width + (x + 2)] += errorPart
        // (x - 1, y + 1)
        if (x - 1 >= 0 && y + 1 < height) lum[(y + 1) * width + (x - 1)] += errorPart
        // (x, y + 1)
        if (y + 1 < height) lum[(y + 1) * width + x] += errorPart
        // (x + 1, y + 1)
        if (x + 1 < width && y + 1 < height) lum[(y + 1) * width + (x + 1)] += errorPart
        // (x, y + 2)
        if (y + 2 < height) lum[(y + 2) * width + x] += errorPart
      }
    }
    return output
  }

  return output
}
