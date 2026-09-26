import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from './components/layout/Navbar'

export default function App() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'editor' | 'simulator' | 'export'>('editor')
  const [guideOpen, setGuideOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cyber-900 text-slate-100 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGuide={() => setGuideOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center py-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sakura via-purple-neon to-cyan-neon sm:text-5xl font-heading mb-4">
            {t('app.title')}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-sans">
            {t('app.tagline')}
          </p>
          {guideOpen && (
            <div className="hidden" aria-hidden="true" />
          )}
        </div>
      </main>
    </div>
  )
}
