import type { AnalyzeResponse } from '../types'
import { ResultCards } from './ResultCards'
import { Bot, User } from 'lucide-react'

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
        <div className="max-w-[85%]">
          <div className="flex items-start gap-3">
            {/* User Avatar */}
            <div className="p-2 bg-accent/10 rounded-full flex-shrink-0">
              <User className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
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
        </div>
      </div>
    )
  }

  // Assistant message
  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-[85%]">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
            <Bot className="w-6 h-6 text-primary" />
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
