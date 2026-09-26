import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search,
  Sliders,
  Shield,
  Zap,
  Brain,
  Globe,
  Monitor,
} from 'lucide-react'

interface DotaInGameSimulatorProps {
  brailleLines: string[]
  gridWidth: number
  gridHeight: number
  configName?: string
}

export const DotaInGameSimulator: React.FC<DotaInGameSimulatorProps> = ({
  brailleLines,
  configName = 'GhoulGrid Anime Art',
}) => {
  const { t } = useTranslation()
  const [selectedAttribute, setSelectedAttribute] = useState<string>('all')

  return (
    <div className="w-full space-y-4">
      {/* Simulator Viewport Container (16:9 Authentic Dota 2 Ratio) */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border-2 border-dota-border bg-dota-bg shadow-2xl flex flex-col justify-between select-none">
        {/* Ambient Dota 2 background smoke / glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(circle at 50% 35%, #182232 0%, #0F141C 60%, #080A0E 100%)',
          }}
        />

        {/* TOP BAR: Dota 2 Pick Screen HUD */}
        <div className="relative z-10 w-full h-12 bg-cyber-950/80 backdrop-blur-md border-b border-dota-border/80 px-6 flex items-center justify-between text-xs text-slate-300">
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

          {/* Right: Layout Switcher dropdown simulator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-dota-surface border border-dota-border text-[11px] font-mono text-slate-300">
              <Sliders className="w-3 h-3 text-dota-gold" />
              <span className="truncate max-w-[130px]">{configName}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-cyber-muted px-2 py-0.5 rounded bg-cyber-900 border border-cyber-border">
              <Monitor className="w-3 h-3 text-cyan-neon" />
              <span>16:9 1080p</span>
            </div>
          </div>
        </div>

        {/* MIDDLE: Grid Canvas Area with Scanlines */}
        <div className="relative z-0 flex-1 overflow-hidden flex items-center justify-center p-4">
          <div className="w-full h-full flex flex-col items-center justify-center">
            {brailleLines.length === 0 ? (
              <div className="text-center py-12 text-cyber-muted text-xs">
                {t('layers.empty')}
              </div>
            ) : (
              <div className="font-mono text-sakura/90 leading-none select-text text-center overflow-auto max-w-full max-h-full">
                {brailleLines.map((line, idx) => (
                  <div key={idx} className="whitespace-pre">
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM BAR: Search and Lock In */}
        <div className="relative z-10 w-full h-12 bg-cyber-950/85 backdrop-blur-md border-t border-dota-border/80 px-6 flex items-center justify-between">
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
