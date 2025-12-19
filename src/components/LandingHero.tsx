interface LandingHeroProps {
  onStart: () => void
}

export function LandingHero({ onStart }: LandingHeroProps) {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8 animate-fade-in">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            From Chart to Clarity
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-3 font-medium">
            MarketSage AI
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your AI-powered trading edge. Upload any crypto candlestick chart and get a professional-grade investment analysis in seconds.
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-sm">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">AI Chart Recognition</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-sm">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-medium">Real-time Market Data</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-sm">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium">Multi-Strategy Analysis</span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          Get Started
        </button>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>⚠️ For educational purposes only. Not financial advice.</p>
        </div>
      </div>
    </div>
  )
}

