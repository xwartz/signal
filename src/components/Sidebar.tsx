import { useI18n } from '../utils/i18n'
import Logo from './Logo'
import type { HistoryItem } from '../types'

interface SidebarProps {
  history: HistoryItem[]
  activeItemId: string | null
  onNewAnalysis: () => void
  onSelectHistory: (item: HistoryItem) => void
  isCollapsed?: boolean
}

export function Sidebar({
  history,
  activeItemId,
  onNewAnalysis,
  onSelectHistory,
  isCollapsed = false,
}: SidebarProps) {
  const { t } = useI18n()

  return (
    <div className={`h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        {!isCollapsed && (
            <Logo />
        )}
      </div>

      {/* New Analysis Button */}
      <div className="p-3">
        <button
          onClick={onNewAnalysis}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all ${isCollapsed ? 'px-2' : ''}`}
          title={t('newAnalysis') || 'New Analysis'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {!isCollapsed && <span className="font-medium">{t('newAnalysis') || 'New Analysis'}</span>}
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                item.id === activeItemId
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              } ${isCollapsed ? 'px-2' : ''}`}
              title={item.title}
            >
              {!isCollapsed ? (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm truncate">{item.title}</span>
                </div>
              ) : (
                <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
