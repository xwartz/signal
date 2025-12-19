import { useState } from 'react'
import { UploadCard } from './components/UploadCard'
import { MacroSelector } from './components/MacroSelector'
import { ResultCards } from './components/ResultCards'
import { ThemeToggle } from './components/ThemeToggle'
import { analyzeImage } from './utils/analyzer'
import { useI18n } from './utils/i18n'
import type { AnalyzeResponse } from './types'

function App() {
  const [image, setImage] = useState('')
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useI18n()

  const handleAnalyze = async (scenarios: string[], period: string) => {
    if (!image) {
      alert(t('uploadAlert'))
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const isDev = import.meta.env.DEV
      let data: AnalyzeResponse

      if (isDev) {
        data = await analyzeImage(image, scenarios, period)
      } else {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image,
            macroScenarios: scenarios,
            period,
          }),
        })

        if (!response.ok) {
          throw new Error('Analysis request failed')
        }

        data = await response.json()
      }

      setResult(data)

      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'Analysis failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {t('title')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t('subtitle')}
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="card border-l-4 border-primary-600">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
              {t('introTitle')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {t('introDescription')}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                {t('featureImageRecognition')}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                {t('featureRealtimeData')}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                {t('featureMultiStrategy')}
              </span>
            </div>
          </div>

          <UploadCard onImageUpload={setImage} />
          <MacroSelector onAnalyze={handleAnalyze} disabled={!image || loading} />

          {loading && (
            <div className="card text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium mb-2">{t('analyzing')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('analyzingDesc')}
              </p>
            </div>
          )}

          {error && (
            <div className="card border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
              <div>
                <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">
                  {t('errorTitle')}
                </h3>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div id="results">
              <ResultCards result={result} />
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>{t('footerDisclaimer')}</p>
        </div>
      </footer>
    </div>
  )
}

export default App
