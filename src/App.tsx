import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { LandingHero } from './components/LandingHero'
import { AnalysisDashboard } from './components/AnalysisDashboard'
import type { HistoryItem, AnalyzeResponse } from './types'

function AppContent() {
  const [isClient, setIsClient] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [activeAnalysis, setActiveAnalysis] = useState<HistoryItem | null>(null)
  const navigate = useNavigate()

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

  return (
    <Routes>
      <Route
        path="/"
        element={<LandingHero onStart={() => navigate('/analyze')} />}
      />
      <Route
        path="/analyze"
        element={
          <AnalysisDashboard
            history={history}
            activeAnalysis={activeAnalysis}
            onNewAnalysis={handleNewAnalysis}
            onStartAnalysis={handleStartAnalysis}
            onSelectHistory={handleSelectHistory}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
