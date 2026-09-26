import React from 'react'
import { useTranslation } from 'react-i18next'
import { GeneratorOptions } from '@/engine/configGenerator'
import { FileCode, Sliders, Layers } from 'lucide-react'

interface ConfigSettingsPanelProps {
  configName: string
  onConfigNameChange: (name: string) => void
  options: GeneratorOptions
  onOptionsChange: (options: GeneratorOptions) => void
  categoryCount: number
}

export const ConfigSettingsPanel: React.FC<ConfigSettingsPanelProps> = ({
  configName,
  onConfigNameChange,
  options,
  onOptionsChange,
  categoryCount,
}) => {
  const { t } = useTranslation()

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyber-border/70 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-green-neon/10 border border-green-neon/30 text-green-neon">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-bold text-white tracking-wide">
              {t('export.title')}
            </h2>
            <p className="text-[11px] text-cyber-muted">
              {t('export.scanlinesCount', { count: categoryCount })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyber-950 border border-cyber-border font-mono text-[11px] text-dota-gold">
          <Layers className="w-3.5 h-3.5" />
          <span>v3 Format</span>
        </div>
      </div>

      {/* Config Name Input */}
      <div className="space-y-1.5">
        <label className="text-xs text-slate-300 font-medium">
          {t('export.configName')}
        </label>
        <input
          type="text"
          value={configName}
          onChange={(e) => onConfigNameChange(e.target.value)}
          placeholder={t('export.configNamePlaceholder')}
          className="w-full bg-cyber-850 border border-cyber-border rounded-xl px-3.5 py-2 text-sm text-white placeholder-cyber-muted focus:border-sakura focus:ring-1 focus:ring-sakura outline-none transition-all"
        />
      </div>

      {/* Coordinate & Scanline Fine-Tuning */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
          <Sliders className="w-3.5 h-3.5 text-cyan-neon" />
          <span>Scanline Geometry & Offset</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Start X */}
          <div className="bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60">
            <span className="text-cyber-muted text-[10px] font-mono block">
              Offset X
            </span>
            <input
              type="number"
              value={options.startX ?? 0}
              onChange={(e) =>
                onOptionsChange({ ...options, startX: Number(e.target.value) })
              }
              className="w-full bg-cyber-950 border border-cyber-border/80 rounded px-2 py-1 text-white font-mono text-xs mt-1"
            />
          </div>

          {/* Start Y */}
          <div className="bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60">
            <span className="text-cyber-muted text-[10px] font-mono block">
              Offset Y
            </span>
            <input
              type="number"
              value={options.startY ?? 0}
              onChange={(e) =>
                onOptionsChange({ ...options, startY: Number(e.target.value) })
              }
              className="w-full bg-cyber-950 border border-cyber-border/80 rounded px-2 py-1 text-white font-mono text-xs mt-1"
            />
          </div>

          {/* Row Height */}
          <div className="bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60">
            <span className="text-cyber-muted text-[10px] font-mono block">
              Row Height
            </span>
            <input
              type="number"
              min={8}
              max={32}
              value={options.rowHeight ?? 16}
              onChange={(e) =>
                onOptionsChange({ ...options, rowHeight: Number(e.target.value) })
              }
              className="w-full bg-cyber-950 border border-cyber-border/80 rounded px-2 py-1 text-white font-mono text-xs mt-1"
            />
          </div>

          {/* Category Width */}
          <div className="bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60">
            <span className="text-cyber-muted text-[10px] font-mono block">
              Width
            </span>
            <input
              type="number"
              value={options.categoryWidth ?? 1100}
              onChange={(e) =>
                onOptionsChange({
                  ...options,
                  categoryWidth: Number(e.target.value),
                })
              }
              className="w-full bg-cyber-950 border border-cyber-border/80 rounded px-2 py-1 text-white font-mono text-xs mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
