import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Layer } from '@/types/layer'
import {
  FlipHorizontal,
  Crosshair,
  Maximize,
  Lock,
  Unlock,
  SlidersHorizontal,
} from 'lucide-react'

interface LayerTransformControlsProps {
  selectedLayer: Layer | null
  canvasWidth: number
  canvasHeight: number
  onUpdateLayer: (id: string, patch: Partial<Layer>) => void
}

export const LayerTransformControls: React.FC<LayerTransformControlsProps> = ({
  selectedLayer,
  canvasWidth,
  canvasHeight,
  onUpdateLayer,
}) => {
  const { t } = useTranslation()
  const [lockAspect, setLockAspect] = useState(true)

  if (!selectedLayer) {
    return (
      <div className="glass-panel rounded-2xl p-4 border border-cyber-border/70 text-center py-6">
        <p className="text-xs text-cyber-muted">
          Select a layer to adjust coordinates and transform properties
        </p>
      </div>
    )
  }

  const handleFlipH = () => {
    onUpdateLayer(selectedLayer.id, { flipH: !selectedLayer.flipH })
  }

  const handleCenter = () => {
    const x = Math.round((canvasWidth - selectedLayer.width) / 2)
    const y = Math.round((canvasHeight - selectedLayer.height) / 2)
    onUpdateLayer(selectedLayer.id, { x, y })
  }

  const handleFitToGrid = () => {
    const scale = Math.min(
      canvasWidth / selectedLayer.naturalWidth,
      canvasHeight / selectedLayer.naturalHeight
    )
    const width = Math.round(selectedLayer.naturalWidth * scale)
    const height = Math.round(selectedLayer.naturalHeight * scale)
    const x = Math.round((canvasWidth - width) / 2)
    const y = Math.round((canvasHeight - height) / 2)
    onUpdateLayer(selectedLayer.id, { x, y, width, height })
  }

  const handleWidthChange = (newWidth: number) => {
    const clampedW = Math.max(10, newWidth)
    if (lockAspect && selectedLayer.width > 0) {
      const ratio = selectedLayer.height / selectedLayer.width
      onUpdateLayer(selectedLayer.id, {
        width: clampedW,
        height: Math.round(clampedW * ratio),
      })
    } else {
      onUpdateLayer(selectedLayer.id, { width: clampedW })
    }
  }

  const handleHeightChange = (newHeight: number) => {
    const clampedH = Math.max(10, newHeight)
    if (lockAspect && selectedLayer.height > 0) {
      const ratio = selectedLayer.width / selectedLayer.height
      onUpdateLayer(selectedLayer.id, {
        height: clampedH,
        width: Math.round(clampedH * ratio),
      })
    } else {
      onUpdateLayer(selectedLayer.id, { height: clampedH })
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-4 border border-cyber-border/70 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-neon/10 border border-purple-neon/30 text-purple-neon">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-bold text-white tracking-wide">
              {t('transform.size')}
            </h2>
            <p className="text-[11px] text-cyber-muted truncate max-w-[180px]">
              {selectedLayer.name}
            </p>
          </div>
        </div>

        {/* Quick Transform Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleFlipH}
            className={`p-1.5 rounded-lg border transition-all ${
              selectedLayer.flipH
                ? 'bg-purple-neon/20 border-purple-neon text-purple-neon shadow-purple-sm'
                : 'bg-cyber-800/80 border-cyber-border text-slate-300 hover:text-white'
            }`}
            title={t('layers.flipH')}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCenter}
            className="p-1.5 rounded-lg bg-cyber-800/80 border border-cyber-border text-slate-300 hover:text-white hover:border-cyan-neon/40 transition-colors"
            title={t('layers.resetTransform')}
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-neon" />
          </button>

          <button
            onClick={handleFitToGrid}
            className="p-1.5 rounded-lg bg-cyber-800/80 border border-cyber-border text-slate-300 hover:text-white hover:border-sakura/40 transition-colors"
            title={t('layers.fitGrid')}
          >
            <Maximize className="w-3.5 h-3.5 text-sakura" />
          </button>

          <button
            onClick={() => setLockAspect(!lockAspect)}
            className={`p-1.5 rounded-lg border transition-colors ${
              lockAspect
                ? 'bg-cyan-neon/15 border-cyan-neon/40 text-cyan-neon'
                : 'bg-cyber-800/80 border-cyber-border text-cyber-muted'
            }`}
            title={t('transform.lockAspect')}
          >
            {lockAspect ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Unlock className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Numeric Coordinate Fine-Tuning Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* X Position */}
        <div className="bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60 flex items-center justify-between">
          <span className="text-cyber-muted font-mono text-[11px]">X Pos</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={selectedLayer.x}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, { x: Number(e.target.value) })
              }
              className="w-16 bg-cyber-950 border border-cyber-border/80 rounded px-1.5 py-0.5 text-right font-mono text-white text-xs focus:border-sakura outline-none"
            />
            <span className="text-[10px] text-cyber-muted">px</span>
          </div>
        </div>

        {/* Y Position */}
        <div className="bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60 flex items-center justify-between">
          <span className="text-cyber-muted font-mono text-[11px]">Y Pos</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={selectedLayer.y}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, { y: Number(e.target.value) })
              }
              className="w-16 bg-cyber-950 border border-cyber-border/80 rounded px-1.5 py-0.5 text-right font-mono text-white text-xs focus:border-cyan-neon outline-none"
            />
            <span className="text-[10px] text-cyber-muted">px</span>
          </div>
        </div>

        {/* Width */}
        <div className="bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60 flex items-center justify-between">
          <span className="text-cyber-muted font-mono text-[11px]">Width</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={10}
              value={selectedLayer.width}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              className="w-16 bg-cyber-950 border border-cyber-border/80 rounded px-1.5 py-0.5 text-right font-mono text-white text-xs focus:border-sakura outline-none"
            />
            <span className="text-[10px] text-cyber-muted">px</span>
          </div>
        </div>

        {/* Height */}
        <div className="bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60 flex items-center justify-between">
          <span className="text-cyber-muted font-mono text-[11px]">Height</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={10}
              value={selectedLayer.height}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              className="w-16 bg-cyber-950 border border-cyber-border/80 rounded px-1.5 py-0.5 text-right font-mono text-white text-xs focus:border-cyan-neon outline-none"
            />
            <span className="text-[10px] text-cyber-muted">px</span>
          </div>
        </div>
      </div>
    </div>
  )
}
