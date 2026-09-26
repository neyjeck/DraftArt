export type DitherAlgorithm = 'none' | 'floyd-steinberg' | 'atkinson'

export interface Layer {
  id: string
  name: string
  imageUrl: string
  imageElement?: HTMLImageElement
  naturalWidth: number
  naturalHeight: number
  x: number           // top-left X in canvas coordinates (pixels)
  y: number           // top-left Y in canvas coordinates (pixels)
  width: number       // width in canvas coordinates (pixels)
  height: number      // height in canvas coordinates (pixels)
  flipH: boolean      // horizontal mirror
  visible: boolean    // layer visibility
  opacity: number     // 0 - 100
  brightness: number  // -100 - 100
  contrast: number    // -100 - 100
  invert: boolean     // invert colors
  sobelEdge: boolean  // enable Sobel edge detection outline
  sobelThreshold: number // 10 - 250 outline sensitivity
  ditherAlgorithm: DitherAlgorithm
  threshold: number   // 0 - 255 binary threshold
  zIndex: number
}

export function createNewLayer(
  name: string,
  imageUrl: string,
  naturalWidth: number,
  naturalHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  zIndex: number
): Layer {
  // Calculate scaled dimensions to fit nicely within the canvas initially
  const scale = Math.min((canvasWidth * 0.8) / naturalWidth, (canvasHeight * 0.8) / naturalHeight, 1)
  const initialWidth = Math.round(naturalWidth * scale)
  const initialHeight = Math.round(naturalHeight * scale)
  const initialX = Math.round((canvasWidth - initialWidth) / 2)
  const initialY = Math.round((canvasHeight - initialHeight) / 2)

  return {
    id: `layer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    imageUrl,
    naturalWidth,
    naturalHeight,
    x: initialX,
    y: initialY,
    width: initialWidth,
    height: initialHeight,
    flipH: false,
    visible: true,
    opacity: 100,
    brightness: 0,
    contrast: 0,
    invert: false,
    sobelEdge: false,
    sobelThreshold: 75,
    ditherAlgorithm: 'atkinson',
    threshold: 128,
    zIndex,
  }
}

export function sortLayersByZIndex(layers: Layer[]): Layer[] {
  return [...layers].sort((a, b) => a.zIndex - b.zIndex)
}
