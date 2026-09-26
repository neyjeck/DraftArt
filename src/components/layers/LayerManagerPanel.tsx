import React from 'react'
import { useTranslation } from 'react-i18next'
import { Layer, sortLayersByZIndex } from '@/types/layer'
import {
  Layers,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
} from 'lucide-react'

interface LayerManagerPanelProps {
  layers: Layer[]
  selectedLayerId: string | null
  onSelectLayer: (id: string) => void
  onToggleVisibility: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export const LayerManagerPanel: React.FC<LayerManagerPanelProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}) => {
  const { t } = useTranslation()
  // Show highest zIndex on top
  const reversedLayers = [...sortLayersByZIndex(layers)].reverse()

  return (
    <div className="glass-panel rounded-2xl p-4 border border-cyber-border/70 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-bold text-white tracking-wide">
              {t('layers.title')}
            </h2>
            <p className="text-[11px] text-cyber-muted">
              {layers.length} {layers.length === 1 ? 'layer' : 'layers'}
            </p>
          </div>
        </div>
      </div>

      {/* Layer List */}
      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
        {layers.length === 0 ? (
          <div className="py-8 text-center text-xs text-cyber-muted bg-cyber-900/40 rounded-xl border border-dashed border-cyber-border">
            {t('layers.empty')}
          </div>
        ) : (
          reversedLayers.map((layer, index) => {
            const isSelected = layer.id === selectedLayerId
            const isTop = index === 0
            const isBottom = index === reversedLayers.length - 1

            return (
              <div
                key={layer.id}
                onClick={() => onSelectLayer(layer.id)}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-sakura/10 border-sakura/80 shadow-sakura-sm'
                    : 'bg-cyber-850/80 border-cyber-border/60 hover:border-cyber-border hover:bg-cyber-800'
                } ${!layer.visible ? 'opacity-50' : ''}`}
              >
                {/* Thumbnail & Title */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-lg bg-cyber-950 border border-cyber-border/70 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      src={layer.imageUrl}
                      alt={layer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white truncate">
                        {layer.name}
                      </span>
                      {layer.flipH && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-neon/15 border border-purple-neon/30 text-purple-neon">
                          Flip
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-cyber-muted font-mono">
                      {layer.width}×{layer.height} px
                    </div>
                  </div>
                </div>

                {/* Layer Control Buttons */}
                <div
                  className="flex items-center gap-1 flex-shrink-0 ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Visibility Toggle */}
                  <button
                    onClick={() => onToggleVisibility(layer.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-cyber-700/60 transition-colors"
                    title={t('layers.visible')}
                  >
                    {layer.visible ? (
                      <Eye className="w-3.5 h-3.5 text-cyan-neon" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-cyber-muted" />
                    )}
                  </button>

                  {/* Move Up */}
                  <button
                    onClick={() => onMoveUp(layer.id)}
                    disabled={isTop}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-cyber-700/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title={t('layers.moveUp')}
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => onMoveDown(layer.id)}
                    disabled={isBottom}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-cyber-700/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title={t('layers.moveDown')}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => onDuplicate(layer.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-purple-neon hover:bg-cyber-700/60 transition-colors"
                    title={t('layers.duplicate')}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(layer.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title={t('layers.delete')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
