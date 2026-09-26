export interface GridDimensions {
  width: number   // width in Braille characters (columns)
  height: number  // height in Braille characters (rows / scanlines)
}

export interface AspectRatioPreset {
  id: string
  nameKey: string
  width: number
  height: number
  ratio: string
}

export const MIN_GRID_WIDTH = 20
export const MAX_GRID_WIDTH = 160
export const MIN_GRID_HEIGHT = 10
export const MAX_GRID_HEIGHT = 100

// 1 Braille Unicode character represents a 2x4 dot matrix
export const BRAILLE_DOT_WIDTH = 2
export const BRAILLE_DOT_HEIGHT = 4

export function calculateSubpixelResolution(width: number, height: number): { canvasWidth: number; canvasHeight: number } {
  return {
    canvasWidth: Math.max(1, width * BRAILLE_DOT_WIDTH),
    canvasHeight: Math.max(1, height * BRAILLE_DOT_HEIGHT),
  }
}
