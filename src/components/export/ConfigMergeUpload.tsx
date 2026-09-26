import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { extractExistingLayoutNames } from '@/engine/configMerger'
import { Upload, CheckCircle2, AlertCircle, X, Layers } from 'lucide-react'

interface ConfigMergeUploadProps {
  existingConfigJson: string | null
  onExistingConfigLoaded: (jsonString: string | null) => void
}

export const ConfigMergeUpload: React.FC<ConfigMergeUploadProps> = ({
  existingConfigJson,
  onExistingConfigLoaded,
}) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const existingLayouts = existingConfigJson
    ? extractExistingLayoutNames(existingConfigJson)
    : []

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const parsed = JSON.parse(content)
        if (!parsed || !Array.isArray(parsed.configs)) {
          setError('Invalid Dota 2 hero_grid_config.json: "configs" list not found.')
          return
        }
        onExistingConfigLoaded(content)
      } catch (err) {
        setError('Failed to parse JSON file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClear = () => {
    onExistingConfigLoaded(null)
    setError(null)
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyber-border/70 space-y-3">
      {/* Header */}
      <div>
        <h3 className="text-sm font-heading font-bold text-white tracking-wide flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-neon" />
          <span>{t('export.mergeTitle')}</span>
        </h3>
        <p className="text-xs text-cyber-muted mt-0.5">
          {t('export.mergeDescription')}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* State: File loaded vs Not loaded */}
      {!existingConfigJson ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-cyber-border hover:border-cyan-neon/50 bg-cyber-850/60 hover:bg-cyber-800/60 rounded-xl p-4 text-center cursor-pointer transition-all"
        >
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <Upload className="w-5 h-5 text-cyan-neon" />
            <span className="text-xs font-medium text-slate-200">
              {t('export.uploadExisting')}
            </span >
            <span className="text-[10px] text-cyber-muted font-mono">
              hero_grid_config.json
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-cyber-950/80 rounded-xl border border-cyan-neon/40 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-neon flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">
                Existing Config Loaded ({existingLayouts.length} layout{existingLayouts.length !== 1 ? 's' : ''})
              </div>
              <div className="text-[11px] text-cyber-muted font-mono mt-0.5 flex flex-wrap gap-1">
                {existingLayouts.map((name, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.2 rounded bg-cyber-850 border border-cyber-border/80 text-cyan-neon"
                  >
                    "{name}"
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="p-1 rounded text-cyber-muted hover:text-white hover:bg-cyber-800 transition-colors"
            title="Remove existing config"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
