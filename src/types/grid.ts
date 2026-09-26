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
  description: string
}

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  {
    id: 'compact',
    nameKey: 'grid.presetCompact',
    width: 40,
    height: 24,
    ratio: '16:10',
    description: 'Compact Block (40×24)',
  },
  {
    id: 'standard',
    nameKey: 'grid.presetStandard',
    width: 60,
    height: 34,
    ratio: '16:9',
    description: 'Standard 16:9 (60×34)',
  },
  {
    id: 'large',
    nameKey: 'grid.presetLarge',
    width: 90,
    height: 50,
    ratio: '16:9',
    description: 'High-Res 16:9 (90×50)',
  },
  {
    id: 'ultrawide',
    nameKey: 'grid.presetUltrawide',
    width: 120,
    height: 50,
    ratio: '21:9',
    description: 'Ultrawide 21:9 (120×50)',
  },
]

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
