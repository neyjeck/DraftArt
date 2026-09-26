import { BRAILLE_DOT_WIDTH, BRAILLE_DOT_HEIGHT } from '@/types/grid'

/**
 * Maps a binary pixel buffer into an array of Unicode Braille lines.
 * Each Braille character is formed from a 2x4 subpixel grid:
 *
 *   [dot 1 (0x01)]  [dot 4 (0x08)]
 *   [dot 2 (0x02)]  [dot 5 (0x10)]
 *   [dot 3 (0x04)]  [dot 6 (0x20)]
 *   [dot 7 (0x40)]  [dot 8 (0x80)]
 *
 * Base Unicode offset is 0x2800.
 */
export function mapBinaryToBrailleLines(
  binaryMatrix: Uint8Array,
  canvasWidth: number,
  canvasHeight: number,
  gridWidth: number,
  gridHeight: number
): string[] {
  const lines: string[] = []

  const getPixel = (x: number, y: number): number => {
    if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) return 0
    return binaryMatrix[y * canvasWidth + x] === 1 ? 1 : 0
  }

  for (let row = 0; row < gridHeight; row++) {
    let lineStr = ''
    for (let col = 0; col < gridWidth; col++) {
      const baseX = col * BRAILLE_DOT_WIDTH
      const baseY = row * BRAILLE_DOT_HEIGHT

      let code = 0
      // Dot 1 (col 0, row 0)
      if (getPixel(baseX, baseY) === 1) code |= 0x01
      // Dot 2 (col 0, row 1)
      if (getPixel(baseX, baseY + 1) === 1) code |= 0x02
      // Dot 3 (col 0, row 2)
      if (getPixel(baseX, baseY + 2) === 1) code |= 0x04
      // Dot 4 (col 1, row 0)
      if (getPixel(baseX + 1, baseY) === 1) code |= 0x08
      // Dot 5 (col 1, row 1)
      if (getPixel(baseX + 1, baseY + 1) === 1) code |= 0x10
      // Dot 6 (col 1, row 2)
      if (getPixel(baseX + 1, baseY + 2) === 1) code |= 0x20
      // Dot 7 (col 0, row 3)
      if (getPixel(baseX, baseY + 3) === 1) code |= 0x40
      // Dot 8 (col 1, row 3)
      if (getPixel(baseX + 1, baseY + 3) === 1) code |= 0x80

      lineStr += String.fromCharCode(0x2800 + code)
    }
    lines.push(lineStr)
  }

  return lines
}
