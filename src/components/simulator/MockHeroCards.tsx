import React, { useState } from 'react'
import { RotateCcw, Eye, EyeOff } from 'lucide-react'

export interface MockHero {
  id: number
  name: string
  attr: 'str' | 'agi' | 'int' | 'uni'
  iconUrl: string
  x: number
  y: number
}

// Iconic Dota 2 heroes with authentic portraits
export const INITIAL_HEROES: MockHero[] = [
  {
    id: 11,
    name: 'Shadow Fiend',
    attr: 'agi',
    iconUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/nevermore.png',
    x: -280,
    y: -80,
  },
  {
    id: 74,
    name: 'Invoker',
    attr: 'int',
    iconUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/invoker.png',
    x: -280,
    y: 0,
  },
  {
    id: 14,
    name: 'Pudge',
    attr: 'str',
    iconUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png',
    x: -280,
    y: 80,
  },
  {
    id: 1,
    name: 'Anti-Mage',
    attr: 'agi',
    iconUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png',
    x: 280,
    y: -80,
  },
  {
    id: 8,
    name: 'Juggernaut',
    attr: 'agi',
    iconUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png',
    x: 280,
    y: 0,
  },
  {
    id: 44,
    name: 'Phantom Assassin',
    attr: 'agi',
    iconUrl: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/phantom_assassin.png',
    x: 280,
    y: 80,
  },
]

interface MockHeroCardsProps {
  showHeroes: boolean
  onToggleShowHeroes: () => void
}

export const MockHeroCards: React.FC<MockHeroCardsProps> = ({
  showHeroes,
  onToggleShowHeroes,
}) => {
  const [heroes, setHeroes] = useState<MockHero[]>(INITIAL_HEROES)
  const [draggingHeroId, setDraggingHeroId] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent, hero: MockHero) => {
    e.stopPropagation()
    setDraggingHeroId(hero.id)
    setDragOffset({ x: e.clientX - hero.x, y: e.clientY - hero.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingHeroId === null) return
    e.stopPropagation()
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    setHeroes((prev) =>
      prev.map((h) => (h.id === draggingHeroId ? { ...h, x: newX, y: newY } : h))
    )
  }

  const handleMouseUp = () => {
    setDraggingHeroId(null)
  }

  const resetPositions = () => {
    setHeroes(INITIAL_HEROES)
  }

  return (
    <>
      {/* Hero Overlay Toggle Toolbar */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleShowHeroes}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            showHeroes
              ? 'bg-dota-gold/20 border border-dota-gold/50 text-dota-gold shadow-sm'
              : 'bg-cyber-850/80 border border-cyber-border text-slate-400 hover:text-white'
          }`}
          title="Toggle Mock Hero Cards"
        >
          {showHeroes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Heroes ({heroes.length})</span>
        </button>

        {showHeroes && (
          <button
            onClick={resetPositions}
            className="p-1 rounded-lg bg-cyber-850/80 border border-cyber-border hover:border-dota-gold/50 text-slate-400 hover:text-white transition-colors"
            title="Reset Hero Positions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Draggable Hero Cards Container */}
      {showHeroes && (
        <div
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
        >
          {heroes.map((hero) => {
            const attrBorder =
              hero.attr === 'str'
                ? 'border-dota-red hover:shadow-[0_0_12px_rgba(224,62,45,0.6)]'
                : hero.attr === 'agi'
                ? 'border-green-neon hover:shadow-[0_0_12px_rgba(80,250,123,0.6)]'
                : hero.attr === 'int'
                ? 'border-cyan-neon hover:shadow-[0_0_12px_rgba(139,233,253,0.6)]'
                : 'border-purple-neon hover:shadow-[0_0_12px_rgba(189,147,249,0.6)]'

            return (
              <div
                key={hero.id}
                onMouseDown={(e) => handleMouseDown(e, hero)}
                className={`absolute w-14 h-18 rounded-md overflow-hidden bg-dota-slot border-2 cursor-grab active:cursor-grabbing pointer-events-auto transition-transform hover:scale-110 shadow-lg select-none ${attrBorder}`}
                style={{
                  left: `calc(50% + ${hero.x}px)`,
                  top: `calc(50% + ${hero.y}px)`,
                  width: '56px',
                  height: '74px',
                }}
                title={`${hero.name} (Drag to position)`}
              >
                <img
                  src={hero.iconUrl}
                  alt={hero.name}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                  onError={(e) => {
                    // Fallback to stylized hero initial if external CDN is blocked
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-white/40 pointer-events-none -z-10">
                  {hero.name.slice(0, 2)}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-cyber-950/80 text-[8px] text-center font-mono truncate text-slate-200 px-0.5">
                  {hero.name}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
