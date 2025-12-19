import type { AnalyzeResponse } from '../types'
import { ResultCards } from './ResultCards'

interface MessageProps {
  role: 'user' | 'assistant'
  content?: string
  imageUrl?: string
  result?: AnalyzeResponse
}

export function Message({ role, content, imageUrl, result }: MessageProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-start mb-6">
        <div className="max-w-[70%]">
          {imageUrl && (
            <div className="bg-card border border-border rounded-lg p-3 shadow-sm">
              <img
                src={imageUrl}
                alt="Uploaded chart"
                className="max-w-md w-full h-auto rounded-lg mx-auto"
              />
            </div>
          )}
          {content && (
            <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 mt-2">
              <p className="text-sm">{content}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Assistant message
  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-[85%]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            {content && (
              <div className="bg-card border border-border rounded-lg px-4 py-3 mb-3 shadow-sm">
                <p className="text-sm text-card-foreground whitespace-pre-wrap">{content}</p>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <ResultCards result={result} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
