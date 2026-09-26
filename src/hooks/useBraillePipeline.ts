import { useState, useEffect, useRef } from 'react'
import { Layer } from '@/types/layer'
import { compositeLayersToImageData } from '@/engine/canvasCompositor'
import { applySobelEdgeDetection } from '@/engine/sobelEdgeDetection'
import { processImageToBinaryMatrix } from '@/engine/ditheringEngine'
import { mapBinaryToBrailleLines } from '@/engine/brailleMapper'

export interface PipelineStats {
  renderTimeMs: number
  charCount: number
  activeDots: number
}

export function useBraillePipeline(
  canvasWidth: number,
  canvasHeight: number,
  gridWidth: number,
  gridHeight: number,
  layers: Layer[],
  globalDither: 'none' | 'floyd-steinberg' | 'atkinson' = 'atkinson',
  globalThreshold: number = 128,
  globalSobel: boolean = false,
  sobelThreshold: number = 75,
  invertOutput: boolean = false
) {
  const [brailleLines, setBrailleLines] = useState<string[]>([])
  const [stats, setStats] = useState<PipelineStats>({
    renderTimeMs: 0,
    charCount: 0,
    activeDots: 0,
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    // Debounce and schedule with requestAnimationFrame for smooth 60fps interaction
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const startTime = performance.now()
      setIsProcessing(true)

      // Step 1: Composite visible layers
      const compositeImageData = compositeLayersToImageData(
        canvasWidth,
        canvasHeight,
        layers
      )

      if (!compositeImageData) {
        setBrailleLines([])
        setIsProcessing(false)
        return
      }

      // Step 2: Edge Detection (if enabled)
      let processedImageData = compositeImageData
      if (globalSobel) {
        processedImageData = applySobelEdgeDetection(
          compositeImageData,
          sobelThreshold,
          invertOutput
        )
      }

      // Step 3: Dithering / Thresholding to 1-bit matrix
      const binaryMatrix = processImageToBinaryMatrix(
        processedImageData,
        globalDither,
        globalThreshold,
        !globalSobel && invertOutput
      )

      // Step 4: Map 2x4 subpixels to Unicode Braille characters
      const lines = mapBinaryToBrailleLines(
        binaryMatrix,
        canvasWidth,
        canvasHeight,
        gridWidth,
        gridHeight
      )

      // Calculate stats
      let activeDotsCount = 0
      for (let i = 0; i < binaryMatrix.length; i++) {
        if (binaryMatrix[i] === 1) activeDotsCount++
      }

      const elapsed = Math.round(performance.now() - startTime)
      setBrailleLines(lines)
      setStats({
        renderTimeMs: elapsed,
        charCount: gridWidth * gridHeight,
        activeDots: activeDotsCount,
      })
      setIsProcessing(false)
    })

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    canvasWidth,
    canvasHeight,
    gridWidth,
    gridHeight,
    layers,
    globalDither,
    globalThreshold,
    globalSobel,
    sobelThreshold,
    invertOutput,
  ])

  return {
    brailleLines,
    brailleText: brailleLines.join('\n'),
    stats,
    isProcessing,
  }
}
