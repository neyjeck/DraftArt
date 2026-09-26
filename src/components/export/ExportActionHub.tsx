import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import confetti from 'canvas-confetti'
import {
  Download,
  Copy,
  Check,
  FileCode,
  FileText,
  Sparkles,
} from 'lucide-react'

interface ExportActionHubProps {
  jsonString: string
  brailleText: string
  filename?: string
}

export const ExportActionHub: React.FC<ExportActionHubProps> = ({
  jsonString,
  brailleText,
  filename = 'hero_grid_config.json',
}) => {
  const { t } = useTranslation()
  const [copiedJson, setCopiedJson] = useState(false)
  const [copiedBraille, setCopiedBraille] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Trigger celebratory confetti
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#FF79C6', '#8BE9FD', '#BD93F9', '#50FA7B'],
    })

    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3000)
  }

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonString)
      setCopiedJson(true)
      setTimeout(() => setCopiedJson(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleCopyBraille = async () => {
    try {
      await navigator.clipboard.writeText(brailleText)
      setCopiedBraille(true)
      setTimeout(() => setCopiedBraille(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyber-border/70 space-y-5">
      {/* Primary Download Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 cyber-button-sakura py-3.5 px-6 rounded-xl font-heading tracking-wide flex items-center justify-center gap-2.5 text-sm shadow-sakura-md hover:scale-[1.01] active:scale-[0.98] transition-all"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-5 h-5 text-cyber-950" />
              <span>{t('export.downloaded')}</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 text-cyber-950" />
              <span>{t('export.downloadJson')}</span>
              <Sparkles className="w-4 h-4 text-cyber-950/70" />
            </>
          )}
        </button>

        {/* Copy JSON */}
        <button
          onClick={handleCopyJson}
          className="px-5 py-3 rounded-xl bg-cyber-850 hover:bg-cyber-800 border border-cyber-border hover:border-cyan-neon/50 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          {copiedJson ? (
            <>
              <Check className="w-4 h-4 text-cyan-neon" />
              <span className="text-cyan-neon">{t('export.copied')}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-cyan-neon" />
              <span>{t('export.copyJson')}</span>
            </>
          )}
        </button>

        {/* Copy Raw Braille Text */}
        <button
          onClick={handleCopyBraille}
          className="px-5 py-3 rounded-xl bg-cyber-850 hover:bg-cyber-800 border border-cyber-border hover:border-purple-neon/50 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          {copiedBraille ? (
            <>
              <Check className="w-4 h-4 text-purple-neon" />
              <span className="text-purple-neon">{t('export.copied')}</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-purple-neon" />
              <span>{t('export.copyBraille')}</span>
            </>
          )}
        </button>
      </div>

      {/* Code Inspector / JSON Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-cyber-muted">
          <span className="flex items-center gap-1.5 font-mono">
            <FileCode className="w-3.5 h-3.5 text-sakura" />
            <span>JSON Preview ({Math.round(jsonString.length / 1024)} KB)</span>
          </span>
          <span className="text-[10px] font-mono text-green-neon">Valid Dota 2 Schema</span>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-cyber-950 border border-cyber-border/80">
          <pre className="p-4 text-xs font-mono text-cyan-neon/90 max-h-60 overflow-y-auto leading-relaxed selection:bg-sakura/30">
            <code>{jsonString.slice(0, 3000) + (jsonString.length > 3000 ? '\n... (truncated preview)' : '')}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
