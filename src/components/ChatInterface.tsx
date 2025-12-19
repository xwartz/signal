import { useState, useCallback, useRef, useEffect } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { ApiKeySettings } from './ApiKeySettings'
import { LanguageToggle } from './LanguageToggle'
import { Message } from './Message'
import { analyzeImage } from '../utils/analyzer'
import type { HistoryItem, AnalyzeResponse } from '../types'

interface ChatInterfaceProps {
  activeAnalysis: HistoryItem | null
  onStartAnalysis: (result: AnalyzeResponse, imagePreview: string) => void
}

type AnalysisStep = {
  id: string
  label: string
  status: 'pending' | 'processing' | 'completed'
}

export function ChatInterface({ activeAnalysis, onStartAnalysis }: ChatInterfaceProps) {
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeAnalysis, loading, analysisSteps])

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size cannot exceed 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImage(result)
      // Auto-start analysis after image upload
      setTimeout(() => handleAnalyze(result), 100)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile()
        if (file) {
          handleFile(file)
          e.preventDefault()
          break
        }
      }
    }
  }, [handleFile])

  const handleAnalyze = async (imageData?: string) => {
    const imageToAnalyze = imageData || image
    if (!imageToAnalyze) {
      return
    }

    setLoading(true)
    setError(null)

    // Initialize analysis steps
    const steps: AnalysisStep[] = [
      { id: '1', label: 'Analyzing chart image...', status: 'processing' },
      { id: '2', label: 'Identifying trading pair and timeframe...', status: 'pending' },
      { id: '3', label: 'Fetching real-time market data...', status: 'pending' },
      { id: '4', label: 'Performing technical analysis...', status: 'pending' },
      { id: '5', label: 'Generating trading recommendations...', status: 'pending' },
    ]
    setAnalysisSteps(steps)

    try {
      // Step 1: Start analyzing chart image
      await new Promise(resolve => setTimeout(resolve, 500))

      // Step 2: Call API (this is the real work)
      setAnalysisSteps(prev => prev.map((step, idx) => {
        if (idx === 0) return { ...step, status: 'completed' }
        if (idx === 1) return { ...step, status: 'processing' }
        return step
      }))

      // The actual API call happens here
      const dataPromise = analyzeImage(imageToAnalyze)

      // Step 3: While waiting for API, show progress through remaining steps
      await new Promise(resolve => setTimeout(resolve, 800))
      setAnalysisSteps(prev => prev.map((step, idx) => {
        if (idx <= 1) return { ...step, status: 'completed' }
        if (idx === 2) return { ...step, status: 'processing' }
        return step
      }))

      await new Promise(resolve => setTimeout(resolve, 600))
      setAnalysisSteps(prev => prev.map((step, idx) => {
        if (idx <= 2) return { ...step, status: 'completed' }
        if (idx === 3) return { ...step, status: 'processing' }
        return step
      }))

      await new Promise(resolve => setTimeout(resolve, 500))
      setAnalysisSteps(prev => prev.map((step, idx) => {
        if (idx <= 3) return { ...step, status: 'completed' }
        if (idx === 4) return { ...step, status: 'processing' }
        return step
      }))

      // Wait for the actual API response
      const data = await dataPromise

      // Step 5: Complete
      setAnalysisSteps(prev => prev.map(step => ({ ...step, status: 'completed' })))
      await new Promise(resolve => setTimeout(resolve, 300))

      onStartAnalysis(data, imageToAnalyze)
      setImage('') // Clear image after successful analysis
      setAnalysisSteps([])
    } catch (err) {
      console.error("Analysis error:", err)
      setError(
        err instanceof Error ? err.message : "Analysis failed, please try again"
      )
      setAnalysisSteps([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              MarketSage AI
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Professional crypto trading analysis powered by AI
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ApiKeySettings />
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {!activeAnalysis && !image && !loading && (
          <div className="max-w-3xl mx-auto text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">
              Hi, I am MarketSage AI
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Whether it's Spot, Futures, or Contracts, just show me the chart. Please upload your K-line screenshot to begin the analysis.
            </p>
          </div>
        )}

        {activeAnalysis && (
          <>
            <Message
              role="user"
              imageUrl={activeAnalysis.imagePreview}
            />
            <Message
              role="assistant"
              result={activeAnalysis.result}
            />
          </>
        )}

        {loading && (
          <div className="flex justify-start mb-6">
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="bg-card border border-border rounded-lg px-4 py-3 shadow-sm flex-1">
                <div className="space-y-3">
                  {analysisSteps.map((step) => (
                    <div key={step.id} className="flex items-center gap-3">
                      {step.status === 'completed' ? (
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : step.status === 'processing' ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-muted rounded-full flex-shrink-0"></div>
                      )}
                      <span className={`text-sm ${
                        step.status === 'completed' ? 'text-foreground' :
                        step.status === 'processing' ? 'text-primary font-medium' :
                        'text-muted-foreground'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-destructive mb-1">Analysis Error</h3>
                  <p className="text-sm text-destructive/80">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onPaste={handlePaste}
            tabIndex={0}
          >
            <svg className="mx-auto h-12 w-12 text-muted-foreground mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-muted-foreground mb-3">
              Drag and drop your chart here, or click to browse
            </p>
            <label className="inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={loading}
              />
              <span className="btn-primary cursor-pointer inline-block text-sm">
                Upload Chart
              </span>
            </label>
            <p className="text-xs text-muted-foreground mt-3">
              Supports: PNG, JPG, JPEG • Max 5MB • Analysis starts automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
