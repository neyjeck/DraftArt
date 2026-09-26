import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UploadCloud, ImagePlus, Sparkles } from 'lucide-react'

interface FileUploadZoneProps {
  onFilesSelected: (files: FileList | File[]) => void
  onLoadDemo?: () => void
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  onLoadDemo,
}) => {
  const { t } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files)
      // reset so same file can be re-selected if needed
      e.target.value = ''
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative rounded-2xl p-6 border-2 border-dashed transition-all duration-300 text-center cursor-pointer select-none group ${
        isDragging
          ? 'border-sakura bg-sakura/10 shadow-sakura-md scale-[1.01]'
          : 'border-cyber-border hover:border-sakura/60 bg-cyber-850/50 hover:bg-cyber-800/60 shadow-cyber-card'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-2.5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sakura/20 to-cyan-neon/20 border border-cyber-border flex items-center justify-center group-hover:scale-110 group-hover:border-sakura/50 transition-all duration-300">
          {isDragging ? (
            <UploadCloud className="w-6 h-6 text-sakura animate-bounce" />
          ) : (
            <ImagePlus className="w-6 h-6 text-sakura group-hover:text-cyan-neon transition-colors" />
          )}
        </div>

        <div>
          <h3 className="text-sm font-heading font-bold text-white group-hover:text-sakura transition-colors">
            {t('layers.uploadTitle')}
          </h3>
          <p className="text-xs text-cyber-muted mt-0.5">
            {t('layers.uploadSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-cyber-800 border border-cyber-border group-hover:border-sakura/40 text-slate-200">
            {t('layers.browse')}
          </span>

          {onLoadDemo && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onLoadDemo()
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-purple-neon/15 hover:bg-purple-neon/25 border border-purple-neon/40 text-purple-neon transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo Art</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
