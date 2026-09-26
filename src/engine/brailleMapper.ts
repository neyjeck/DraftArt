import { BRAILLE_DOT_WIDTH, BRAILLE_DOT_HEIGHT } from '@/types/grid'

/**
 * Unicode Braille Pattern Blank (U+2800): '⠀'
 * CRITICAL FOR DOTA 2 SOURCE 2 ENGINE:
 * Standard ASCII spaces are trimmed and collapsed by Dota 2's UI layout parser.
 * Using U+2800 preserves exact monospace column alignment and geometric fidelity.
 */
export const BRAILLE_BLANK_CHAR = '\u2800'

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

      // When code === 0, 0x2800 is precisely BRAILLE_BLANK_CHAR
      lineStr += String.fromCharCode(0x2800 + code)
    }
    // Enforce strictly no ASCII whitespace
    lines.push(enforceSource2BrailleSanitizer(lineStr))
  }

  return lines
}

/**
 * Replaces any ASCII whitespace with the invisible Braille Pattern Blank (\u2800).
 * Ensures Dota 2 Source 2 does not trim or collapse lines.
 */
export function enforceSource2BrailleSanitizer(text: string): string {
  // Replace ASCII space (0x20), non-breaking space (0xA0), tabs with \u2800
  return text.replace(/[ \t\u00A0]/g, BRAILLE_BLANK_CHAR)
}

/**
 * Validates that all empty spaces in text conform to U+2800 Braille Blank.
 */
export function isSource2SafeBraille(text: string): boolean {
  return !/[ \t\u00A0]/.test(text)
}
