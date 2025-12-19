import { useState, useEffect, useCallback } from 'react'
import { LandingHero } from './components/LandingHero'
import { Sidebar } from './components/Sidebar'
import { ChatInterface } from './components/ChatInterface'
import type { HistoryItem, AnalyzeResponse } from './types'

function App() {
  const [isAppStarted, setIsAppStarted] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [activeAnalysis, setActiveAnalysis] = useState<HistoryItem | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNewAnalysis = useCallback(() => {
    setActiveAnalysis(null)
  }, [])

  const handleStartAnalysis = useCallback((result: AnalyzeResponse, imagePreview: string) => {
    const newId = `analysis-${Date.now()}`
    const newHistoryItem: HistoryItem = {
      id: newId,
      title: `${result.detected.symbol} ${result.detected.timeframe}`,
      timestamp: Date.now(),
      result: result,
      imagePreview: imagePreview,
    }
    setHistory(prev => [newHistoryItem, ...prev])
    setActiveAnalysis(newHistoryItem)
  }, [])

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setActiveAnalysis(item)
  }, [])

  if (!isClient) {
    return null
  }

  if (!isAppStarted) {
    return <LandingHero onStart={() => setIsAppStarted(true)} />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        history={history}
        activeItemId={activeAnalysis?.id || null}
        onNewAnalysis={handleNewAnalysis}
        onSelectHistory={handleSelectHistory}
      />
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          activeAnalysis={activeAnalysis}
          onStartAnalysis={handleStartAnalysis}
        />
      </div>
    </div>
  )
}

export default App
