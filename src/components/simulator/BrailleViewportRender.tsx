import React, { useState } from 'react'
import { Palette, Eye } from 'lucide-react'

interface BrailleViewportRenderProps {
  brailleLines: string[]
  gridWidth: number
  gridHeight: number
  fontSize?: number
}

export type BrailleColorTheme = 'sakura' | 'cyan' | 'slate' | 'radiant' | 'dire'

const THEME_STYLES: Record<
  BrailleColorTheme,
  { text: string; glow: string; name: string }
> = {
  sakura: {
    text: 'text-[#FF79C6]',
    glow: 'drop-shadow-[0_0_8px_rgba(255,121,198,0.4)]',
    name: 'Sakura Pink',
  },
  cyan: {
    text: 'text-[#8BE9FD]',
    glow: 'drop-shadow-[0_0_8px_rgba(139,233,253,0.4)]',
    name: 'Cyber Cyan',
  },
  slate: {
    text: 'text-[#D2D6DC]',
    glow: 'drop-shadow-[0_0_4px_rgba(210,214,220,0.2)]',
    name: 'Dota 2 Classic',
  },
  radiant: {
    text: 'text-[#50FA7B]',
    glow: 'drop-shadow-[0_0_8px_rgba(80,250,123,0.4)]',
    name: 'Radiant Emerald',
  },
  dire: {
    text: 'text-[#FF5555]',
    glow: 'drop-shadow-[0_0_8px_rgba(255,85,85,0.4)]',
    name: 'Dire Crimson',
  },
}

export const BrailleViewportRender: React.FC<BrailleViewportRenderProps> = ({
  brailleLines,
  gridWidth,
  gridHeight,
  fontSize = 11,
}) => {
  const [theme, setTheme] = useState<BrailleColorTheme>('sakura')
  const [showLineNumbers, setShowLineNumbers] = useState(false)

  const activeTheme = THEME_STYLES[theme]

  return (
    <div className="w-full flex flex-col items-center select-none space-y-2">
      {/* Theme and Display Toolbar */}
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-cyber-950/80 border border-cyber-border/70 backdrop-blur-md text-xs">
        <div className="flex items-center gap-1.5 text-cyber-muted">
          <Palette className="w-3.5 h-3.5 text-sakura" />
          <span>Color:</span>
        </div>
        <div className="flex items-center gap-1">
          {(Object.keys(THEME_STYLES) as BrailleColorTheme[]).map((key) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                theme === key
                  ? 'bg-cyber-800 border border-sakura text-white font-bold'
                  : 'text-cyber-muted hover:text-white'
              }`}
            >
              {THEME_STYLES[key].name}
            </button>
          ))}
        </div>

        <div className="h-3 w-[1px] bg-cyber-border mx-1" />

        <div className="text-[10px] font-mono text-cyber-muted px-1.5 py-0.5 rounded bg-cyber-900 border border-cyber-border">
          {gridWidth}×{gridHeight}
        </div>

        <button
          onClick={() => setShowLineNumbers(!showLineNumbers)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
            showLineNumbers
              ? 'bg-purple-neon/20 border border-purple-neon/40 text-purple-neon'
              : 'text-cyber-muted hover:text-white'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>Lines</span>
        </button>
      </div>

      {/* Panorama / Source 2 Typography Renderer */}
      <div
        className={`font-mono select-text transition-colors duration-200 ${activeTheme.text} ${activeTheme.glow}`}
        style={{
          fontFamily: "'JetBrains Mono', 'Segoe UI Symbol', monospace",
          fontSize: `${fontSize}px`,
          lineHeight: '0.92',
          letterSpacing: '-0.05em',
          whiteSpace: 'pre',
        }}
      >
        {brailleLines.map((line, rowIdx) => (
          <div key={rowIdx} className="flex items-center justify-center">
            {showLineNumbers && (
              <span className="text-[9px] text-cyber-muted/60 font-mono w-6 text-right mr-3 select-none">
                {rowIdx + 1}
              </span>
            )}
            <span className="tracking-tighter">{line}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
