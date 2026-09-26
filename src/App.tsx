import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from './components/layout/Navbar'
import { GridConfigPanel } from './components/grid/GridConfigPanel'
import { FileUploadZone } from './components/layers/FileUploadZone'
import { LayerManagerPanel } from './components/layers/LayerManagerPanel'
import { InteractiveCanvasStudio } from './components/canvas/InteractiveCanvasStudio'
import { LayerTransformControls } from './components/transform/LayerTransformControls'
import { LayerFilterControls } from './components/filters/LayerFilterControls'
import { EngineSettingsPanel } from './components/engine/EngineSettingsPanel'
import { DotaInGameSimulator } from './components/simulator/DotaInGameSimulator'
import { ConfigSettingsPanel } from './components/export/ConfigSettingsPanel'
import { ConfigMergeUpload } from './components/export/ConfigMergeUpload'
import { ExportActionHub } from './components/export/ExportActionHub'
import { SteamGuideModal } from './components/modals/SteamGuideModal'
import { useLayers } from './hooks/useLayers'
import { useBraillePipeline } from './hooks/useBraillePipeline'
import { calculateSubpixelResolution } from './types/grid'
import { DitherAlgorithm, createNewLayer } from './types/layer'
import { buildDotaHeroGridConfig, GeneratorOptions } from './engine/configGenerator'
import { mergeDotaGridConfigs } from './engine/configMerger'
import {
  ShieldCheck,
  Github,
  MonitorPlay,
  Sliders,
  FileCode,
} from 'lucide-react'

export default function App() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'editor' | 'simulator' | 'export'>('editor')
  const [guideOpen, setGuideOpen] = useState(false)

  // Grid Dimensions State (Default: Standard 16:9 => 60 chars x 34 lines)
  const [gridWidth, setGridWidth] = useState(60)
  const [gridHeight, setGridHeight] = useState(34)

  const { canvasWidth, canvasHeight } = useMemo(
    () => calculateSubpixelResolution(gridWidth, gridHeight),
    [gridWidth, gridHeight]
  )

  // Multi-Layer Store Hook
  const {
    layers,
    setLayers,
    selectedLayerId,
    setSelectedLayerId,
    selectedLayer,
    addMultipleFiles,
    updateLayer,
    deleteLayer,
    duplicateLayer,
    moveLayerUp,
    moveLayerDown,
    toggleLayerVisibility,
    clearLayers,
  } = useLayers()

  // Computer Vision & Dithering Engine Settings
  const [algorithm, setAlgorithm] = useState<DitherAlgorithm>('atkinson')
  const [threshold, setThreshold] = useState(128)
  const [sobelEnabled, setSobelEnabled] = useState(false)
  const [sobelThreshold, setSobelThreshold] = useState(75)
  const [invertOutput, setInvertOutput] = useState(false)

  // Pipeline Hook (processes canvas composite -> CV -> Braille)
  const { brailleLines, brailleText, stats } = useBraillePipeline(
    canvasWidth,
    canvasHeight,
    gridWidth,
    gridHeight,
    layers,
    algorithm,
    threshold,
    sobelEnabled,
    sobelThreshold,
    invertOutput
  )

  // Config Generator State
  const [configName, setConfigName] = useState('GhoulGrid Anime Art')
  const [generatorOptions, setGeneratorOptions] = useState<GeneratorOptions>({
    startX: 0,
    startY: 0,
    rowHeight: 16,
    categoryWidth: 1100,
  })
  const [existingConfigJson, setExistingConfigJson] = useState<string | null>(null)

  // Generate output JSON (either standalone or merged with existing user config)
  const outputJsonString = useMemo(() => {
    const freshRoot = buildDotaHeroGridConfig(configName, brailleLines, generatorOptions)
    if (!existingConfigJson) {
      return JSON.stringify(freshRoot, null, 2)
    }
    try {
      const mergedRoot = mergeDotaGridConfigs(existingConfigJson, freshRoot.configs[0])
      return JSON.stringify(mergedRoot, null, 2)
    } catch {
      return JSON.stringify(freshRoot, null, 2)
    }
  }, [configName, brailleLines, generatorOptions, existingConfigJson])

  // Demo Art Generator (Draws an anime cyberpunk masked character on an offscreen canvas)
  const handleLoadDemoArt = () => {
    const demoCanvas = document.createElement('canvas')
    demoCanvas.width = 400
    demoCanvas.height = 400
    const ctx = demoCanvas.getContext('2d')
    if (!ctx) return

    // Cyberpunk gradient background
    const bgGrad = ctx.createRadialGradient(200, 200, 30, 200, 200, 200)
    bgGrad.addColorStop(0, '#2D1B4E')
    bgGrad.addColorStop(1, '#0D0E18')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 400, 400)

    // Anime silhouette & glowing eyes / mask
    ctx.strokeStyle = '#FF79C6'
    ctx.lineWidth = 6
    ctx.shadowColor = '#FF79C6'
    ctx.shadowBlur = 15

    // Hair outline
    ctx.beginPath()
    ctx.moveTo(200, 50)
    ctx.lineTo(130, 120)
    ctx.lineTo(150, 180)
    ctx.lineTo(100, 230)
    ctx.lineTo(160, 260)
    ctx.lineTo(190, 340)
    ctx.lineTo(210, 340)
    ctx.lineTo(240, 260)
    ctx.lineTo(300, 230)
    ctx.lineTo(250, 180)
    ctx.lineTo(270, 120)
    ctx.closePath()
    ctx.stroke()

    // Glowing Ghoul Eye (Kakugan)
    ctx.fillStyle = '#FF5555'
    ctx.shadowColor = '#FF5555'
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.arc(170, 195, 14, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(168, 193, 4, 0, Math.PI * 2)
    ctx.fill()

    // Normal Eye
    ctx.fillStyle = '#8BE9FD'
    ctx.shadowColor = '#8BE9FD'
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.arc(230, 195, 12, 0, Math.PI * 2)
    ctx.fill()

    // Ghoul Mask Teeth
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 3
    ctx.shadowBlur = 5
    ctx.beginPath()
    ctx.rect(160, 250, 80, 28)
    ctx.stroke()

    for (let x = 175; x < 235; x += 12) {
      ctx.beginPath()
      ctx.moveTo(x, 250)
      ctx.lineTo(x, 278)
      ctx.stroke()
    }

    const dataUrl = demoCanvas.toDataURL('image/png')
    const img = new Image()
    img.onload = () => {
      const maxZ = layers.length > 0 ? Math.max(...layers.map((l) => l.zIndex)) : 0
      const demoLayer = createNewLayer(
        'Tokyo Ghoul Kakugan',
        dataUrl,
        400,
        400,
        canvasWidth,
        canvasHeight,
        maxZ + 1
      )
      demoLayer.imageElement = img
      setLayers((prev) => [...prev, demoLayer])
      setSelectedLayerId(demoLayer.id)
    }
    img.src = dataUrl
  }

  const handleResetCanvas = () => {
    clearLayers()
    setGridWidth(60)
    setGridHeight(34)
  }

  return (
    <div className="min-h-screen bg-cyber-900 text-slate-100 flex flex-col selection:bg-sakura/30 selection:text-sakura">
      {/* Anime Cyberpunk Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGuide={() => setGuideOpen(true)}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: CANVAS STUDIO */}
        {activeTab === 'editor' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Control Column (Grid + Upload + Layers + Engine) */}
              <div className="lg:col-span-4 space-y-5">
                <GridConfigPanel
                  width={gridWidth}
                  height={gridHeight}
                  onWidthChange={setGridWidth}
                  onHeightChange={setGridHeight}
                  onReset={handleResetCanvas}
                />

                <FileUploadZone
                  onFilesSelected={(files) =>
                    addMultipleFiles(files, canvasWidth, canvasHeight)
                  }
                  onLoadDemo={handleLoadDemoArt}
                />

                <LayerManagerPanel
                  layers={layers}
                  selectedLayerId={selectedLayerId}
                  onSelectLayer={setSelectedLayerId}
                  onToggleVisibility={toggleLayerVisibility}
                  onMoveUp={moveLayerUp}
                  onMoveDown={moveLayerDown}
                  onDuplicate={duplicateLayer}
                  onDelete={deleteLayer}
                />

                <EngineSettingsPanel
                  algorithm={algorithm}
                  threshold={threshold}
                  sobelEnabled={sobelEnabled}
                  sobelThreshold={sobelThreshold}
                  invertOutput={invertOutput}
                  stats={stats}
                  onAlgorithmChange={setAlgorithm}
                  onThresholdChange={setThreshold}
                  onSobelToggle={setSobelEnabled}
                  onSobelThresholdChange={setSobelThreshold}
                  onInvertToggle={setInvertOutput}
                />
              </div>

              {/* Right Canvas Column (Canvas Board + Transform + Filters) */}
              <div className="lg:col-span-8 space-y-5">
                <InteractiveCanvasStudio
                  canvasWidth={canvasWidth}
                  canvasHeight={canvasHeight}
                  layers={layers}
                  selectedLayer={selectedLayer}
                  onSelectLayer={setSelectedLayerId}
                  onUpdateLayer={updateLayer}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <LayerTransformControls
                    selectedLayer={selectedLayer}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    onUpdateLayer={updateLayer}
                  />

                  <LayerFilterControls
                    selectedLayer={selectedLayer}
                    onUpdateLayer={updateLayer}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IN-GAME SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-cyber-850/60 border border-cyber-border">
              <div>
                <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
                  <MonitorPlay className="w-5 h-5 text-cyan-neon" />
                  <span>{t('simulator.title')}</span>
                </h2>
                <p className="text-xs text-cyber-muted mt-0.5">
                  {t('simulator.description')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('editor')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyber-800 border border-cyber-border hover:border-sakura/50 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-sakura" />
                  <span>Back to Editor</span>
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  className="cyber-button-sakura px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sakura-sm"
                >
                  <FileCode className="w-3.5 h-3.5 text-cyber-950" />
                  <span>Export Config</span>
                </button>
              </div>
            </div>

            <DotaInGameSimulator
              brailleLines={brailleLines}
              gridWidth={gridWidth}
              gridHeight={gridHeight}
              configName={configName}
            />
          </div>
        )}

        {/* TAB 3: CONFIG EXPORT */}
        {activeTab === 'export' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
            <ConfigSettingsPanel
              configName={configName}
              onConfigNameChange={setConfigName}
              options={generatorOptions}
              onOptionsChange={setGeneratorOptions}
              categoryCount={brailleLines.length}
            />

            <ConfigMergeUpload
              existingConfigJson={existingConfigJson}
              onExistingConfigLoaded={setExistingConfigJson}
            />

            <ExportActionHub
              jsonString={outputJsonString}
              brailleText={brailleText}
              filename="hero_grid_config.json"
            />
          </div>
        )}
      </main>

      {/* Steam Installation Guide Modal */}
      <SteamGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-cyber-border/70 bg-cyber-950/90 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cyber-muted">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sakura">GhoulGrid Studio</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-green-neon">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('app.clientOnlyBadge')}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setGuideOpen(true)}
              className="hover:text-sakura transition-colors"
            >
              Steam Install Guide
            </button>
            <a
              href="https://github.com/neyjeck/DraftArt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-cyan-neon transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
