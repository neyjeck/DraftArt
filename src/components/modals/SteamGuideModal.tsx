import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  X,
  BookOpen,
  Folder,
  Copy,
  Check,
  Gamepad2,
  HelpCircle,
  Sparkles,
} from 'lucide-react'

interface SteamGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SteamGuideModal: React.FC<SteamGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation()
  const [copiedPath, setCopiedPath] = useState<string | null>(null)
  const [activeOS, setActiveOS] = useState<'win' | 'linux' | 'mac'>('win')

  if (!isOpen) return null

  const paths = {
    win: 'C:\\Program Files (x86)\\Steam\\userdata\\<YourSteamID>\\570\\remote\\cfg\\hero_grid_config.json',
    linux: '~/.local/share/Steam/userdata/<YourSteamID>/570/remote/cfg/hero_grid_config.json',
    mac: '~/Library/Application Support/Steam/userdata/<YourSteamID>/570/remote/cfg/hero_grid_config.json',
  }

  const handleCopyPath = (path: string, osKey: string) => {
    navigator.clipboard.writeText(path)
    setCopiedPath(osKey)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cyber-900 border border-cyber-border rounded-2xl p-6 shadow-2xl space-y-5 border-t-sakura/50 z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-neon/15 border border-purple-neon/40 text-purple-neon">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-white tracking-wide flex items-center gap-2">
                <span>{t('guide.title')}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sakura/10 border border-sakura/30 text-sakura">
                  Dota 2
                </span>
              </h2>
              <p className="text-xs text-cyber-muted mt-0.5">
                {t('guide.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cyber-muted hover:text-white hover:bg-cyber-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OS Path Tabs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-cyan-neon" />
              <span>Target Configuration Path</span>
            </span>
            <div className="flex items-center gap-1 bg-cyber-950 p-0.5 rounded-lg border border-cyber-border text-[11px] font-mono">
              <button
                onClick={() => setActiveOS('win')}
                className={`px-2 py-0.5 rounded ${
                  activeOS === 'win'
                    ? 'bg-cyber-800 text-cyan-neon font-bold'
                    : 'text-cyber-muted hover:text-white'
                }`}
              >
                Windows
              </button>
              <button
                onClick={() => setActiveOS('linux')}
                className={`px-2 py-0.5 rounded ${
                  activeOS === 'linux'
                    ? 'bg-cyber-800 text-cyan-neon font-bold'
                    : 'text-cyber-muted hover:text-white'
                }`}
              >
                Linux
              </button>
              <button
                onClick={() => setActiveOS('mac')}
                className={`px-2 py-0.5 rounded ${
                  activeOS === 'mac'
                    ? 'bg-cyber-800 text-cyan-neon font-bold'
                    : 'text-cyber-muted hover:text-white'
                }`}
              >
                macOS
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-cyber-950 border border-cyber-border font-mono text-xs text-slate-300 gap-2">
            <span className="truncate selection:bg-sakura/30">
              {paths[activeOS]}
            </span>
            <button
              onClick={() => handleCopyPath(paths[activeOS], activeOS)}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-cyber-850 hover:bg-cyber-800 border border-cyber-border text-xs text-cyan-neon hover:text-white transition-colors"
            >
              {copiedPath === activeOS ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-neon" />
                  <span className="text-green-neon">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Steps Walkthrough */}
        <div className="space-y-3 pt-2">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-cyber-850/60 border border-cyber-border/60">
            <div className="w-6 h-6 rounded-full bg-sakura/15 border border-sakura/40 text-sakura text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                {t('guide.step1Title')}
              </div>
              <div className="text-[11px] text-cyber-muted mt-0.5">
                {t('guide.step1Desc')} Replace <code className="text-cyan-neon font-mono">&lt;YourSteamID&gt;</code> with your 32-bit Steam Account ID.
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-cyber-850/60 border border-cyber-border/60">
            <div className="w-6 h-6 rounded-full bg-cyan-neon/15 border border-cyan-neon/40 text-cyan-neon text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                {t('guide.step2Title')}
              </div>
              <div className="text-[11px] text-cyber-muted mt-0.5">
                {t('guide.step2Desc')}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-cyber-850/60 border border-cyber-border/60">
            <div className="w-6 h-6 rounded-full bg-purple-neon/15 border border-purple-neon/40 text-purple-neon text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                {t('guide.step3Title')}
              </div>
              <div className="text-[11px] text-cyber-muted mt-0.5">
                {t('guide.step3Desc')}
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-cyber-850/60 border border-cyber-border/60">
            <div className="w-6 h-6 rounded-full bg-green-neon/15 border border-green-neon/40 text-green-neon text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              4
            </div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>{t('guide.step4Title')}</span>
                <Gamepad2 className="w-3.5 h-3.5 text-green-neon" />
              </div>
              <div className="text-[11px] text-cyber-muted mt-0.5">
                {t('guide.step4Desc')}
              </div>
            </div>
          </div>
        </div>

        {/* Tip Box */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-cyber-950/80 border border-dota-gold/30 text-xs">
          <HelpCircle className="w-4 h-4 text-dota-gold flex-shrink-0 mt-0.5" />
          <p className="text-slate-300 text-[11px]">
            {t('guide.steamIdTip')}
          </p>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="cyber-button-sakura px-5 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-2 shadow-sakura-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyber-950" />
            <span>{t('guide.close')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
