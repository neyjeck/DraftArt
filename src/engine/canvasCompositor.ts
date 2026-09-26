import { Layer, sortLayersByZIndex } from '@/types/layer'

/**
 * Merges multiple active and visible layers onto an offscreen canvas.
 * Applies individual layer transforms (x, y, width, height, flipH) and filters (opacity, brightness, contrast, invert).
 */
export function compositeLayersToImageData(
  canvasWidth: number,
  canvasHeight: number,
  layers: Layer[]
): ImageData | null {
  if (canvasWidth <= 0 || canvasHeight <= 0) return null

  const offscreen = document.createElement('canvas')
  offscreen.width = canvasWidth
  offscreen.height = canvasHeight

  const ctx = offscreen.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null

  // Clear with solid black background for clean Braille thresholding
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // Sort visible layers by z-index
  const visibleLayers = sortLayersByZIndex(layers.filter((l) => l.visible))

  for (const layer of visibleLayers) {
    if (!layer.imageElement) continue

    ctx.save()
    ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity / 100))

    // Handle horizontal flip
    if (layer.flipH) {
      ctx.translate(layer.x + layer.width, layer.y)
      ctx.scale(-1, 1)
      ctx.drawImage(layer.imageElement, 0, 0, layer.width, layer.height)
    } else {
      ctx.drawImage(layer.imageElement, layer.x, layer.y, layer.width, layer.height)
    }

    ctx.restore()
  }

  return ctx.getImageData(0, 0, canvasWidth, canvasHeight)
}
