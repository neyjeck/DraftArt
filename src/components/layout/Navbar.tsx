import React from 'react'
import { useTranslation } from 'react-i18next'
import { supportedLanguages } from '@/i18n'
import {
  Sparkles,
  Github,
  BookOpen,
  Sliders,
  MonitorPlay,
  FileCode,
  Globe,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react'

interface NavbarProps {
  activeTab: 'editor' | 'simulator' | 'export'
  setActiveTab: (tab: 'editor' | 'simulator' | 'export') => void
  onOpenGuide: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenGuide,
}) => {
  const { t, i18n } = useTranslation()
  const [langMenuOpen, setLangMenuOpen] = React.useState(false)
  const currentLang = supportedLanguages.find((l) => l.code === i18n.language) || supportedLanguages[0]

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('ghoulgrid_lang', code)
    setLangMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyber-border/70 bg-cyber-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 select-none">
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sakura via-purple-neon to-cyan-neon p-[1.5px] shadow-sakura-sm group-hover:shadow-sakura-md transition-shadow duration-300">
              <div className="w-full h-full bg-cyber-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-sakura animate-pulse" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-neon animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sakura via-[#FF92D0] to-cyan-neon">
                {t('app.title')}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-sakura/10 border border-sakura/30 text-sakura font-semibold">
                DOTA 2
              </span>
            </div>
            <p className="text-[11px] text-cyber-muted hidden md:block">
              {t('app.subtitle')}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center p-1 bg-cyber-850/80 rounded-xl border border-cyber-border/80 shadow-inner">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === 'editor'
                ? 'bg-gradient-to-r from-sakura/25 to-purple-neon/20 text-sakura border border-sakura/40 shadow-sakura-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-cyber-800/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-sakura" />
            <span>{t('nav.editor')}</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-cyan-neon/25 to-purple-neon/20 text-cyan-neon border border-cyan-neon/40 shadow-cyan-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-cyber-800/60'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5 text-cyan-neon" />
            <span>{t('nav.simulator')}</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === 'export'
                ? 'bg-gradient-to-r from-green-neon/25 to-cyan-neon/20 text-green-neon border border-green-neon/40 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-cyber-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-green-neon" />
            <span>{t('nav.export')}</span>
          </button>
        </nav>

        {/* Actions: Guide, Language & GitHub */}
        <div className="flex items-center gap-2.5">
          {/* Steam Guide Modal Trigger */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyber-800/60 border border-cyber-border hover:border-sakura/50 text-slate-200 hover:text-white transition-all shadow-sm group"
            title={t('nav.guide')}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-neon group-hover:text-sakura transition-colors" />
            <span className="hidden lg:inline">{t('nav.guide')}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-cyber-800/70 border border-cyber-border hover:border-cyan-neon/50 text-slate-200 hover:text-white transition-all"
              aria-label="Change language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-neon" />
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline font-mono uppercase">{currentLang.code}</span>
              <ChevronDown className={`w-3 h-3 text-cyber-muted transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-cyber-850/95 border border-cyber-border/80 shadow-2xl p-1 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                        i18n.language === lang.code
                          ? 'bg-sakura/15 text-sakura border border-sakura/30 font-semibold'
                          : 'text-slate-300 hover:bg-cyber-750 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      <span className="text-[10px] font-mono text-cyber-muted uppercase">
                        {lang.code}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Source 2 Safe Badge */}
          <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyber-900 border border-green-neon/30 text-[11px] text-green-neon/90 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-green-neon" />
            <span>\u2800 Safe</span>
          </div>

          {/* GitHub Repo */}
          <a
            href="https://github.com/neyjeck/DraftArt"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-cyber-800/60 border border-cyber-border hover:border-sakura/60 text-slate-300 hover:text-sakura transition-all shadow-sm hover:scale-105"
            title={t('nav.github')}
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
