import { useState, useCallback } from 'react'
import { Sidebar } from './Sidebar'
import { ChatInterface } from './ChatInterface'
import type { HistoryItem, AnalyzeResponse } from '../types'

interface AnalysisDashboardProps {
  history: HistoryItem[]
  activeAnalysis: HistoryItem | null
  onNewAnalysis: () => void
  onStartAnalysis: (result: AnalyzeResponse, imagePreview: string) => void
  onSelectHistory: (item: HistoryItem) => void
}

export function AnalysisDashboard({
  history,
  activeAnalysis,
  onNewAnalysis,
  onStartAnalysis,
  onSelectHistory,
}: AnalysisDashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleNewAnalysis = useCallback(() => {
    onNewAnalysis()
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [onNewAnalysis])

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    onSelectHistory(item)
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [onSelectHistory])

  return (
    <div className="flex h-screen bg-background overflow-hidden animate-fade-in">
      <Sidebar
        history={history}
        activeItemId={activeAnalysis?.id || null}
        onNewAnalysis={handleNewAnalysis}
        onSelectHistory={handleSelectHistory}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 -ml-1 hover:bg-muted rounded-md"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="font-semibold">{activeAnalysis?.title || 'K-Snap'}</div>
          <div className="w-6" /> {/* Spacer for balance */}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden relative">
          <ChatInterface
            activeAnalysis={activeAnalysis}
            onStartAnalysis={onStartAnalysis}
          />
        </div>
      </div>
    </div>
  )
}
