import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  MIN_GRID_WIDTH,
  MAX_GRID_WIDTH,
  MIN_GRID_HEIGHT,
  MAX_GRID_HEIGHT,
  calculateSubpixelResolution,
} from '@/types/grid'
import { Grid, Cpu, RotateCcw } from 'lucide-react'

interface GridConfigPanelProps {
  width: number
  height: number
  onWidthChange: (w: number) => void
  onHeightChange: (h: number) => void
  onReset: () => void
}

export const GridConfigPanel: React.FC<GridConfigPanelProps> = ({
  width,
  height,
  onWidthChange,
  onHeightChange,
  onReset,
}) => {
  const { t } = useTranslation()
  const { canvasWidth, canvasHeight } = calculateSubpixelResolution(width, height)

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyber-border/70 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sakura/10 border border-sakura/30 text-sakura">
            <Grid className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-bold text-white tracking-wide">
              {t('grid.title')}
            </h2>
            <p className="text-[11px] text-cyber-muted">
              {width} × {height} {t('grid.width').toLowerCase()}
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg text-slate-300 hover:text-white bg-cyber-800/80 hover:bg-cyber-750 border border-cyber-border transition-colors"
          title={t('grid.clearAll')}
        >
          <RotateCcw className="w-3 h-3 text-cyan-neon" />
          <span className="text-[11px]">{t('grid.clearAll')}</span>
        </button>
      </div>

      {/* Grid Width and Height Inputs */}
      <div className="grid grid-cols-2 gap-3">
        {/* Width (Characters) */}
        <div className="space-y-1.5 bg-cyber-850/80 p-3 rounded-xl border border-cyber-border/60">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="grid-width-slider" className="text-slate-300 font-medium">
              {t('grid.width')}
            </label>
            <span className="font-mono font-bold text-sakura text-xs">
              {width}
            </span>
          </div>
          <input
            id="grid-width-slider"
            type="range"
            min={MIN_GRID_WIDTH}
            max={MAX_GRID_WIDTH}
            value={width}
            onChange={(e) => onWidthChange(Number(e.target.value))}
            className="w-full accent-sakura h-1.5 bg-cyber-700 rounded-lg cursor-pointer appearance-none"
          />
          <div className="flex justify-between text-[10px] text-cyber-muted font-mono">
            <span>{MIN_GRID_WIDTH}</span>
            <span>{MAX_GRID_WIDTH}</span>
          </div>
        </div>

        {/* Height (Lines) */}
        <div className="space-y-1.5 bg-cyber-850/80 p-3 rounded-xl border border-cyber-border/60">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="grid-height-slider" className="text-slate-300 font-medium">
              {t('grid.height')}
            </label>
            <span className="font-mono font-bold text-cyan-neon text-xs">
              {height}
            </span>
          </div>
          <input
            id="grid-height-slider"
            type="range"
            min={MIN_GRID_HEIGHT}
            max={MAX_GRID_HEIGHT}
            value={height}
            onChange={(e) => onHeightChange(Number(e.target.value))}
            className="w-full accent-cyan-neon h-1.5 bg-cyber-700 rounded-lg cursor-pointer appearance-none"
          />
          <div className="flex justify-between text-[10px] text-cyber-muted font-mono">
            <span>{MIN_GRID_HEIGHT}</span>
            <span>{MAX_GRID_HEIGHT}</span>
          </div>
        </div>
      </div>

      {/* Subpixel Resolution Indicator */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyber-950/60 border border-cyber-border/40 text-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-purple-neon" />
          <span className="text-slate-300 text-[11px]">
            {t('grid.subpixels', { w: canvasWidth, h: canvasHeight })}
          </span>
        </div>
        <span className="font-mono text-[11px] text-purple-neon font-semibold">
          {canvasWidth}×{canvasHeight}
        </span>
      </div>
    </div>
  )
}
