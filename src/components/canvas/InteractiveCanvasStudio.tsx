import React, { useRef, useState, useEffect } from 'react'
import { Layer } from '@/types/layer'
import { Move, Maximize2 } from 'lucide-react'

interface InteractiveCanvasStudioProps {
  canvasWidth: number
  canvasHeight: number
  layers: Layer[]
  selectedLayer: Layer | null
  onSelectLayer: (id: string | null) => void
  onUpdateLayer: (id: string, patch: Partial<Layer>) => void
}

type HandleType = 'nw' | 'ne' | 'se' | 'sw' | 'move' | null

export const InteractiveCanvasStudio: React.FC<InteractiveCanvasStudioProps> = ({
  canvasWidth,
  canvasHeight,
  layers,
  selectedLayer,
  onSelectLayer,
  onUpdateLayer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeHandle, setActiveHandle] = useState<HandleType>(null)
  const [dragStart, setDragStart] = useState<{
    mouseX: number
    mouseY: number
    layerX: number
    layerY: number
    layerW: number
    layerH: number
  } | null>(null)

  // Calculate container scale to fit responsive viewport
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.clientWidth - 40
      const containerHeight = 520
      const scaleX = containerWidth / canvasWidth
      const scaleY = containerHeight / canvasHeight
      setZoomLevel(Math.min(scaleX, scaleY, 2.5))
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [canvasWidth, canvasHeight])

  // Start drag/resize operation
  const handleMouseDown = (
    e: React.MouseEvent,
    handle: HandleType,
    layerId: string
  ) => {
    e.stopPropagation()
    e.preventDefault()
    onSelectLayer(layerId)

    if (!selectedLayer || selectedLayer.id !== layerId) return

    setActiveHandle(handle)
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      layerX: selectedLayer.x,
      layerY: selectedLayer.y,
      layerW: selectedLayer.width,
      layerH: selectedLayer.height,
    })
  }

  // Handle dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!activeHandle || !dragStart || !selectedLayer) return

      const deltaX = Math.round((e.clientX - dragStart.mouseX) / zoomLevel)
      const deltaY = Math.round((e.clientY - dragStart.mouseY) / zoomLevel)

      if (activeHandle === 'move') {
        onUpdateLayer(selectedLayer.id, {
          x: dragStart.layerX + deltaX,
          y: dragStart.layerY + deltaY,
        })
      } else if (activeHandle === 'se') {
        const newW = Math.max(10, dragStart.layerW + deltaX)
        const newH = Math.max(10, dragStart.layerH + deltaY)
        onUpdateLayer(selectedLayer.id, { width: newW, height: newH })
      } else if (activeHandle === 'sw') {
        const newW = Math.max(10, dragStart.layerW - deltaX)
        const newH = Math.max(10, dragStart.layerH + deltaY)
        onUpdateLayer(selectedLayer.id, {
          x: dragStart.layerX + (dragStart.layerW - newW),
          width: newW,
          height: newH,
        })
      } else if (activeHandle === 'ne') {
        const newW = Math.max(10, dragStart.layerW + deltaX)
        const newH = Math.max(10, dragStart.layerH - deltaY)
        onUpdateLayer(selectedLayer.id, {
          y: dragStart.layerY + (dragStart.layerH - newH),
          width: newW,
          height: newH,
        })
      } else if (activeHandle === 'nw') {
        const newW = Math.max(10, dragStart.layerW - deltaX)
        const newH = Math.max(10, dragStart.layerH - deltaY)
        onUpdateLayer(selectedLayer.id, {
          x: dragStart.layerX + (dragStart.layerW - newW),
          y: dragStart.layerY + (dragStart.layerH - newH),
          width: newW,
          height: newH,
        })
      }
    }

    const handleMouseUp = () => {
      setActiveHandle(null)
      setDragStart(null)
    }

    if (activeHandle) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [activeHandle, dragStart, selectedLayer, zoomLevel, onUpdateLayer])

  return (
    <div
      ref={containerRef}
      onClick={() => onSelectLayer(null)}
      className="relative w-full h-[520px] rounded-2xl bg-cyber-950/90 border border-cyber-border/80 overflow-hidden flex items-center justify-center p-6 shadow-2xl select-none"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 233, 253, 0.08) 1px, transparent 0)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Zoom indicator & controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyber-900/90 border border-cyber-border text-xs text-cyber-muted font-mono backdrop-blur-md">
        <Maximize2 className="w-3.5 h-3.5 text-cyan-neon" />
        <span>Canvas: {canvasWidth}×{canvasHeight}px</span>
        <span className="text-sakura">({Math.round(zoomLevel * 100)}%)</span>
      </div>

      {/* Main Scaled Canvas Board */}
      <div
        className="relative bg-[#07080D] rounded-lg border-2 border-sakura/30 shadow-sakura-sm transition-transform duration-75"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Render Layers */}
        {layers
          .filter((l) => l.visible)
          .map((layer) => {
            const isSelected = selectedLayer?.id === layer.id

            return (
              <div
                key={layer.id}
                onMouseDown={(e) => handleMouseDown(e, 'move', layer.id)}
                className={`absolute cursor-move select-none ${
                  isSelected ? 'z-30' : ''
                }`}
                style={{
                  left: `${layer.x}px`,
                  top: `${layer.y}px`,
                  width: `${layer.width}px`,
                  height: `${layer.height}px`,
                  zIndex: isSelected ? 99 : layer.zIndex,
                }}
              >
                {/* Image Element */}
                <img
                  src={layer.imageUrl}
                  alt={layer.name}
                  draggable={false}
                  className="w-full h-full object-fill pointer-events-none"
                  style={{
                    transform: layer.flipH ? 'scaleX(-1)' : 'none',
                    opacity: layer.opacity / 100,
                    filter: `brightness(${100 + layer.brightness}%) contrast(${100 + layer.contrast}%) ${layer.invert ? 'invert(1)' : ''}`,
                  }}
                />

                {/* Bounding Box & Resize Handles for Selected Layer */}
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-sakura shadow-sakura-md pointer-events-none">
                    {/* Corner Handles */}
                    {/* NW */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'nw', layer.id)}
                      className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-cyan-neon border-2 border-cyber-950 rounded-sm cursor-nwse-resize pointer-events-auto shadow-cyan-sm hover:scale-125 transition-transform"
                    />
                    {/* NE */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'ne', layer.id)}
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-cyan-neon border-2 border-cyber-950 rounded-sm cursor-nesw-resize pointer-events-auto shadow-cyan-sm hover:scale-125 transition-transform"
                    />
                    {/* SE */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'se', layer.id)}
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-cyan-neon border-2 border-cyber-950 rounded-sm cursor-nwse-resize pointer-events-auto shadow-cyan-sm hover:scale-125 transition-transform"
                    />
                    {/* SW */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'sw', layer.id)}
                      className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-cyan-neon border-2 border-cyber-950 rounded-sm cursor-nesw-resize pointer-events-auto shadow-cyan-sm hover:scale-125 transition-transform"
                    />

                    {/* Drag Move Badge */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-cyber-950/90 border border-sakura text-[10px] font-mono text-sakura flex items-center gap-1 shadow-lg pointer-events-none">
                      <Move className="w-2.5 h-2.5" />
                      <span>{layer.width}×{layer.height}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
