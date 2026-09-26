import React from 'react'
import { useTranslation } from 'react-i18next'
import { Layer } from '@/types/layer'
import {
  Sun,
  Contrast,
  Sliders,
  Sparkles,
  RotateCcw,
} from 'lucide-react'

interface LayerFilterControlsProps {
  selectedLayer: Layer | null
  onUpdateLayer: (id: string, patch: Partial<Layer>) => void
}

export const LayerFilterControls: React.FC<LayerFilterControlsProps> = ({
  selectedLayer,
  onUpdateLayer,
}) => {
  const { t } = useTranslation()

  if (!selectedLayer) {
    return null
  }

  const handleResetFilters = () => {
    onUpdateLayer(selectedLayer.id, {
      opacity: 100,
      brightness: 0,
      contrast: 0,
      invert: false,
    })
  }

  return (
    <div className="glass-panel rounded-2xl p-4 border border-cyber-border/70 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sakura/10 border border-sakura/30 text-sakura">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-bold text-white tracking-wide">
              {t('layers.opacity')} & Filters
            </h2>
            <p className="text-[11px] text-cyber-muted truncate max-w-[180px]">
              {selectedLayer.name}
            </p>
          </div>
        </div>

        <button
          onClick={handleResetFilters}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg text-slate-300 hover:text-white bg-cyber-800/80 border border-cyber-border transition-colors"
          title="Reset layer filters"
        >
          <RotateCcw className="w-3 h-3 text-cyan-neon" />
          <span className="text-[10px]">Reset</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-2.5 text-xs">
        {/* Opacity */}
        <div className="space-y-1 bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sakura" />
              <span>{t('layers.opacity')}</span>
            </span>
            <span className="font-mono text-sakura font-bold">
              {selectedLayer.opacity}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={selectedLayer.opacity}
            onChange={(e) =>
              onUpdateLayer(selectedLayer.id, { opacity: Number(e.target.value) })
            }
            className="w-full accent-sakura h-1.5 bg-cyber-700 rounded-lg cursor-pointer appearance-none"
          />
        </div>

        {/* Brightness */}
        <div className="space-y-1 bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-yellow-neon" />
              <span>{t('layers.brightness')}</span>
            </span>
            <span className="font-mono text-yellow-neon font-bold">
              {selectedLayer.brightness > 0 ? `+${selectedLayer.brightness}` : selectedLayer.brightness}%
            </span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={selectedLayer.brightness}
            onChange={(e) =>
              onUpdateLayer(selectedLayer.id, { brightness: Number(e.target.value) })
            }
            className="w-full accent-yellow-neon h-1.5 bg-cyber-700 rounded-lg cursor-pointer appearance-none"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-1 bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Contrast className="w-3.5 h-3.5 text-cyan-neon" />
              <span>{t('layers.contrast')}</span>
            </span>
            <span className="font-mono text-cyan-neon font-bold">
              {selectedLayer.contrast > 0 ? `+${selectedLayer.contrast}` : selectedLayer.contrast}%
            </span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={selectedLayer.contrast}
            onChange={(e) =>
              onUpdateLayer(selectedLayer.id, { contrast: Number(e.target.value) })
            }
            className="w-full accent-cyan-neon h-1.5 bg-cyber-700 rounded-lg cursor-pointer appearance-none"
          />
        </div>

        {/* Invert Colors Toggle */}
        <div className="bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60 flex items-center justify-between">
          <span className="text-slate-300 font-medium">
            {t('layers.invert')}
          </span>
          <button
            onClick={() =>
              onUpdateLayer(selectedLayer.id, { invert: !selectedLayer.invert })
            }
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              selectedLayer.invert
                ? 'bg-purple-neon/20 border-purple-neon text-purple-neon shadow-purple-sm'
                : 'bg-cyber-800 border-cyber-border text-slate-400 hover:text-white'
            }`}
          >
            {selectedLayer.invert ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  )
}
