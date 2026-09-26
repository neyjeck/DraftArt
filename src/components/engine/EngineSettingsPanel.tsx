import React from 'react'
import { useTranslation } from 'react-i18next'
import { DitherAlgorithm } from '@/types/layer'
import { PipelineStats } from '@/hooks/useBraillePipeline'
import {
  Sparkles,
  Zap,
  Activity,
  Binary,
} from 'lucide-react'

interface EngineSettingsPanelProps {
  algorithm: DitherAlgorithm
  threshold: number
  sobelEnabled: boolean
  sobelThreshold: number
  invertOutput: boolean
  stats: PipelineStats
  onAlgorithmChange: (algo: DitherAlgorithm) => void
  onThresholdChange: (threshold: number) => void
  onSobelToggle: (enabled: boolean) => void
  onSobelThresholdChange: (threshold: number) => void
  onInvertToggle: (invert: boolean) => void
}

export const EngineSettingsPanel: React.FC<EngineSettingsPanelProps> = ({
  algorithm,
  threshold,
  sobelEnabled,
  sobelThreshold,
  invertOutput,
  stats,
  onAlgorithmChange,
  onThresholdChange,
  onSobelToggle,
  onSobelThresholdChange,
  onInvertToggle,
}) => {
  const { t } = useTranslation()

  return (
    <div className="glass-panel rounded-2xl p-4 border border-cyber-border/70 space-y-4">
      {/* Header with Live Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-green-neon/10 border border-green-neon/30 text-green-neon">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-bold text-white tracking-wide">
              {t('layers.dithering')} & CV
            </h2>
            <p className="text-[11px] text-cyber-muted">
              Computer Vision & Braille Core
            </p>
          </div>
        </div>

        {/* Live Performance Stats Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyber-950/80 border border-cyber-border/80 font-mono text-[10px]">
          <Activity className="w-3 h-3 text-green-neon animate-pulse" />
          <span className="text-slate-300">{stats.renderTimeMs}ms</span>
          <span className="text-cyber-muted">|</span>
          <span className="text-sakura">{stats.charCount} chars</span>
        </div>
      </div>

      {/* Dithering Algorithm Selector */}
      <div className="space-y-1.5">
        <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
          <Binary className="w-3.5 h-3.5 text-cyan-neon" />
          <span>{t('layers.dithering')}</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'atkinson', label: t('layers.ditherAtkinson') },
              { id: 'floyd-steinberg', label: t('layers.ditherFloyd') },
              { id: 'none', label: t('layers.ditherNone') },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => onAlgorithmChange(item.id)}
              className={`p-2 rounded-xl text-left border text-xs transition-all ${
                algorithm === item.id
                  ? 'bg-cyan-neon/15 border-cyan-neon text-white font-semibold shadow-cyan-sm'
                  : 'bg-cyber-850/60 border-cyber-border text-slate-300 hover:border-cyber-border hover:bg-cyber-800'
              }`}
            >
              <div className="truncate">{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Threshold Slider */}
      <div className="space-y-1 bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300">{t('layers.threshold')}</span>
          <span className="font-mono text-cyan-neon font-bold">{threshold}</span>
        </div>
        <input
          type="range"
          min={10}
          max={245}
          value={threshold}
          onChange={(e) => onThresholdChange(Number(e.target.value))}
          className="w-full accent-cyan-neon h-1.5 bg-cyber-700 rounded-lg cursor-pointer appearance-none"
        />
      </div>

      {/* Sobel Edge Detection Toggle & Slider */}
      <div className="space-y-2 bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-neon" />
            <span>{t('layers.sobel')}</span>
          </span>
          <button
            onClick={() => onSobelToggle(!sobelEnabled)}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border transition-all ${
              sobelEnabled
                ? 'bg-purple-neon/20 border-purple-neon text-purple-neon shadow-purple-sm'
                : 'bg-cyber-800 border-cyber-border text-slate-400 hover:text-white'
            }`}
          >
            {sobelEnabled ? 'ACTIVE' : 'OFF'}
          </button>
        </div>

        {sobelEnabled && (
          <div className="pt-1.5 space-y-1 border-t border-cyber-border/50">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-cyber-muted">{t('layers.sobelThreshold')}</span>
              <span className="font-mono text-purple-neon">{sobelThreshold}</span>
            </div>
            <input
              type="range"
              min={20}
              max={200}
              value={sobelThreshold}
              onChange={(e) => onSobelThresholdChange(Number(e.target.value))}
              className="w-full accent-purple-neon h-1.5 bg-cyber-700 rounded-lg cursor-pointer appearance-none"
            />
          </div>
        )}
      </div>

      {/* Global Invert Output */}
      <div className="bg-cyber-850/80 p-2.5 rounded-xl border border-cyber-border/60 flex items-center justify-between text-xs">
        <span className="text-slate-300 font-medium">
          {t('layers.invert')} (Black / White)
        </span>
        <button
          onClick={() => onInvertToggle(!invertOutput)}
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
            invertOutput
              ? 'bg-sakura/20 border-sakura text-sakura shadow-sakura-sm'
              : 'bg-cyber-800 border-cyber-border text-slate-400 hover:text-white'
          }`}
        >
          {invertOutput ? 'INVERTED' : 'NORMAL'}
        </button>
      </div>
    </div>
  )
}
