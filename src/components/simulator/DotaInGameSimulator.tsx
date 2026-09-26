import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search,
  Sliders,
  Shield,
  Zap,
  Brain,
  Globe,
  Monitor,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Hand,
} from 'lucide-react'
import { BrailleViewportRender } from './BrailleViewportRender'

interface DotaInGameSimulatorProps {
  brailleLines: string[]
  gridWidth: number
  gridHeight: number
  configName?: string
}

export const DotaInGameSimulator: React.FC<DotaInGameSimulatorProps> = ({
  brailleLines,
  gridWidth,
  gridHeight,
  configName = 'GhoulGrid Anime Art',
}) => {
  const { t } = useTranslation()
  const [selectedAttribute, setSelectedAttribute] = useState<string>('all')

  // Pan and Zoom Navigation State
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const viewportRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom((z) => Math.min(3, Math.round((z + 0.15) * 100) / 100))
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, Math.round((z - 0.15) * 100) / 100))
  const handleResetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle click, right click, or when holding Alt/Space
    if (e.button === 1 || e.button === 0 || e.altKey) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92
    setZoom((z) => Math.min(3, Math.max(0.4, Math.round(z * zoomFactor * 100) / 100)))
  }

  return (
    <div className="w-full space-y-3">
      {/* Simulator Viewport Container (16:9 Authentic Dota 2 Ratio) */}
      <div
        ref={viewportRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`relative w-full aspect-[16/9] rounded-2xl overflow-hidden border-2 border-dota-border bg-dota-bg shadow-2xl flex flex-col justify-between select-none ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Ambient Dota 2 background smoke / glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(circle at 50% 35%, #182232 0%, #0F141C 60%, #080A0E 100%)',
          }}
        />

        {/* TOP BAR: Dota 2 Pick Screen HUD */}
        <div className="relative z-20 w-full h-12 bg-cyber-950/85 backdrop-blur-md border-b border-dota-border/80 px-6 flex items-center justify-between text-xs text-slate-300 pointer-events-auto">
          {/* Left: Attributes Filter */}
          <div className="flex items-center gap-1.5 bg-dota-surface/80 p-1 rounded-lg border border-dota-border/60">
            <button
              onClick={() => setSelectedAttribute('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedAttribute === 'all'
                  ? 'bg-dota-gold/20 text-dota-gold border border-dota-gold/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setSelectedAttribute('str')}
              className={`p-1 rounded transition-colors ${
                selectedAttribute === 'str'
                  ? 'bg-dota-red/25 text-dota-red border border-dota-red/50'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Strength"
            >
              <Shield className="w-3.5 h-3.5 text-dota-red" />
            </button>
            <button
              onClick={() => setSelectedAttribute('agi')}
              className={`p-1 rounded transition-colors ${
                selectedAttribute === 'agi'
                  ? 'bg-green-neon/25 text-green-neon border border-green-neon/50'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Agility"
            >
              <Zap className="w-3.5 h-3.5 text-green-neon" />
            </button>
            <button
              onClick={() => setSelectedAttribute('int')}
              className={`p-1 rounded transition-colors ${
                selectedAttribute === 'int'
                  ? 'bg-cyan-neon/25 text-cyan-neon border border-cyan-neon/50'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Intelligence"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-neon" />
            </button>
            <button
              onClick={() => setSelectedAttribute('uni')}
              className={`p-1 rounded transition-colors ${
                selectedAttribute === 'uni'
                  ? 'bg-purple-neon/25 text-purple-neon border border-purple-neon/50'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Universal"
            >
              <Globe className="w-3.5 h-3.5 text-purple-neon" />
            </button>
          </div>

          {/* Center: Dota 2 Hero Selection Header */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 tracking-widest font-heading text-[11px] uppercase">
              HERO SELECTION
            </span>
            <span className="font-mono text-dota-gold font-bold text-sm bg-dota-gold/10 px-2 py-0.5 rounded border border-dota-gold/30">
              0:45
            </span>
          </div>

          {/* Right: Layout Switcher & Pan/Zoom Controls */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-cyber-900/90 border border-cyber-border rounded-lg p-0.5">
              <button
                onClick={handleZoomOut}
                className="p-1 rounded hover:bg-cyber-800 text-slate-300 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[10px] text-cyan-neon px-1">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1 rounded hover:bg-cyber-800 text-slate-300 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1 rounded hover:bg-cyber-800 text-slate-300 hover:text-sakura transition-colors"
                title="Reset Pan & Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-dota-surface border border-dota-border text-[11px] font-mono text-slate-300">
              <Sliders className="w-3 h-3 text-dota-gold" />
              <span className="truncate max-w-[130px]">{configName}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-cyber-muted px-2 py-0.5 rounded bg-cyber-900 border border-cyber-border">
              <Monitor className="w-3 h-3 text-cyan-neon" />
              <span>16:9</span>
            </div>
          </div>
        </div>

        {/* MIDDLE: Grid Canvas Area with Zoom and Pan Transforms */}
        <div className="relative z-10 flex-1 overflow-hidden flex items-center justify-center p-4">
          <div
            className="transition-transform duration-75 flex flex-col items-center justify-center will-change-transform"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            {brailleLines.length === 0 ? (
              <div className="text-center py-12 text-cyber-muted text-xs">
                {t('layers.empty')}
              </div>
            ) : (
              <BrailleViewportRender
                brailleLines={brailleLines}
                gridWidth={gridWidth}
                gridHeight={gridHeight}
              />
            )}
          </div>
        </div>

        {/* Pan Hint Overlay */}
        <div className="absolute bottom-14 left-6 z-20 pointer-events-none flex items-center gap-1.5 text-[10px] font-mono text-cyber-muted/80 bg-cyber-950/60 backdrop-blur-sm px-2 py-0.5 rounded border border-cyber-border/40">
          <Hand className="w-3 h-3 text-cyan-neon" />
          <span>Click & Drag to Pan | Scroll to Zoom</span>
        </div>

        {/* BOTTOM BAR: Search and Lock In */}
        <div className="relative z-20 w-full h-12 bg-cyber-950/85 backdrop-blur-md border-t border-dota-border/80 px-6 flex items-center justify-between pointer-events-auto">
          {/* Search box */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-dota-surface border border-dota-border text-xs text-slate-300 w-48">
            <Search className="w-3.5 h-3.5 text-cyber-muted" />
            <input
              type="text"
              placeholder="Search hero..."
              disabled
              className="bg-transparent border-none outline-none text-xs text-white placeholder-cyber-muted w-full cursor-not-allowed"
            />
          </div>

          {/* Action Button: Imitate Select Hero */}
          <div className="flex items-center gap-3">
            <button
              disabled
              className="px-6 py-1.5 rounded bg-gradient-to-r from-dota-red to-dota-darkRed text-white font-heading font-bold text-xs tracking-wider border border-dota-red/40 shadow-lg opacity-80 cursor-not-allowed"
            >
              SELECT HERO
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
