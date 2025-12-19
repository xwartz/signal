import { useI18n } from '../utils/i18n'
import Logo from './Logo'
import { ArrowRight, PlayCircle, Zap, Brain, ShieldCheck, Sparkles } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface LandingHeroProps {
  onStart: () => void
}

export function LandingHero({ onStart }: LandingHeroProps) {
  const { t } = useI18n()

  const handleWatchDemo = () => {
    alert('🎬 演示视频即将上线，敬请期待！\n\n您可以点击「立即分析」直接体验产品功能。')
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col">
      {/* Grid background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 dark:opacity-5 pointer-events-none z-0"></div>

      {/* Navigation */}
      <nav className="relative z-10 w-full px-4 md:px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <Logo />
        <ThemeToggle />
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 pt-6 pb-16 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Hero text */}
        <div className="text-center max-w-4xl mx-auto mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground leading-tight">
            截图即分析，<span className="gradient-text">秒懂行情走势</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground mb-4">
            {t('heroSubtitle')}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('heroDescription')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onStart}
              className="group btn-primary text-base md:text-lg px-6 md:px-8 py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              {t('heroButton')}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleWatchDemo}
              className="bg-card border border-border hover:bg-card/80 text-foreground font-medium py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <PlayCircle className="h-5 w-5 text-primary" />
              观看演示
            </button>
          </div>
        </div>

        {/* Interactive Demo Panel */}
        <div className="w-full relative mt-6 group animate-fade-in-up">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
            {/* Window controls */}
            <div className="h-10 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-4 text-xs text-muted-foreground font-medium">K-Snap Analysis Demo</span>
            </div>

            {/* Demo content */}
            <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-[500px]">
              {/* Left: Phone mockup */}
              <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border bg-muted/30 p-6 md:p-8 flex flex-col items-center justify-center relative">
                <div className="absolute top-4 left-4">
                  <span className="bg-card text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm text-primary uppercase tracking-wide border border-border">
                    Step 1: 上传
                  </span>
                </div>

                {/* Phone frame */}
                <div className="w-[180px] md:w-[200px] h-[360px] md:h-[400px] bg-gray-900 dark:bg-gray-950 rounded-[2.5rem] p-2.5 shadow-2xl ring-1 ring-white/10 relative transform hover:scale-105 transition-transform duration-500">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-24 bg-black rounded-b-xl z-20"></div>

                  {/* Screen */}
                  <div className="w-full h-full bg-slate-800 rounded-[2rem] overflow-hidden relative">
                    {/* Chart image placeholder - use gradient */}
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center">
                      {/* K-line visualization */}
                      <svg className="w-4/5 h-1/2 opacity-60" viewBox="0 0 100 50" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                        {/* Candlesticks */}
                        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x, i) => (
                          <g key={i}>
                            <line x1={x} y1={15 + Math.sin(i) * 8} x2={x} y2={35 + Math.cos(i) * 8} stroke={i % 2 === 0 ? '#10b981' : '#ef4444'} strokeWidth="4" />
                            <line x1={x} y1={10 + Math.sin(i) * 5} x2={x} y2={40 + Math.cos(i) * 5} stroke={i % 2 === 0 ? '#10b981' : '#ef4444'} strokeWidth="1" />
                          </g>
                        ))}
                      </svg>
                    </div>

                    {/* Scan animation */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent h-1/4 animate-scan border-b-2 border-primary shadow-glow"></div>

                    {/* Scanning text */}
                    <div className="absolute bottom-8 left-0 right-0 px-4 text-center">
                      <div className="bg-black/70 backdrop-blur-md text-white text-xs py-2.5 rounded-lg border border-white/10 flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        正在扫描形态...
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: AI connection indicator (hidden on mobile) */}
              <div className="hidden md:flex absolute top-1/2 left-1/3 transform -translate-y-1/2 -translate-x-1/2 z-20">
                <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 p-2.5 bg-card rounded-full shadow-lg border border-border">
                  <Sparkles className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>

              {/* Right: Analysis panel */}
              <div className="w-full md:w-2/3 p-4 md:p-8 bg-card relative flex flex-col">
                <div className="absolute top-4 left-4 md:left-8">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wide">
                    Step 2: AI 分析
                  </span>
                </div>

                {/* Analysis header */}
                <div className="flex justify-between items-center mb-4 mt-8 md:mt-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground">BTC 分析</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      实时预测
                    </p>
                  </div>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-lg">置信度: 87%</span>
                </div>

                {/* Chart visualization */}
                <div className="flex-grow relative bg-muted/50 rounded-xl p-4 border border-border mb-4 min-h-[180px] md:min-h-[200px] overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="predictionGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3"></stop>
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line className="text-border" stroke="currentColor" strokeDasharray="4" strokeWidth="1" x1="0" x2="600" y1="50" y2="50" />
                    <line className="text-border" stroke="currentColor" strokeDasharray="4" strokeWidth="1" x1="0" x2="600" y1="100" y2="100" />
                    <line className="text-border" stroke="currentColor" strokeDasharray="4" strokeWidth="1" x1="0" x2="600" y1="150" y2="150" />
                    {/* Historical line */}
                    <path className="opacity-50" d="M0,160 C50,150 100,170 150,120 C200,70 250,130 300,100 C350,70 400,90 450,50" fill="none" stroke="var(--color-muted-foreground)" strokeWidth="2" />
                    {/* Prediction line */}
                    <path className="animate-pulse" d="M450,50 C500,30 550,20 600,40" fill="none" stroke="var(--color-primary)" strokeDasharray="5,5" strokeWidth="3" />
                    {/* Current point */}
                    <circle cx="450" cy="50" r="5" fill="var(--color-primary)" />
                    {/* Prediction point */}
                    <circle className="animate-ping" cx="600" cy="40" r="4" fill="var(--color-primary)" />
                    <circle cx="600" cy="40" r="4" fill="var(--color-primary)" />
                    {/* Prediction area */}
                    <path d="M450,50 C500,30 550,20 600,40 V200 H450 Z" fill="url(#predictionGradient)" />
                  </svg>

                  {/* AI Signal tooltip */}
                  <div className="absolute top-1/4 right-1/4 bg-card shadow-lg rounded-lg p-3 border border-border max-w-[180px] hidden sm:block">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-foreground">AI 信号: 买入</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">在 4 小时时间框架上检测到看涨背离</p>
                  </div>
                </div>

                {/* Trading recommendations */}
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg border border-border text-center">
                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-1">目标价</p>
                    <p className="text-base md:text-lg font-bold text-green-500">$64,230</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg border border-border text-center">
                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-1">止损</p>
                    <p className="text-base md:text-lg font-bold text-red-500">$59,800</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg border border-border text-center">
                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-1">风险回报</p>
                    <p className="text-base md:text-lg font-bold text-primary">1:3.2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-col items-center text-center p-4 md:p-6 rounded-xl hover:bg-card/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">极速分析</h3>
            <p className="text-sm text-muted-foreground">毫秒级图像识别，不错过任何波动</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 md:p-6 rounded-xl hover:bg-card/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">深度学习模型</h3>
            <p className="text-sm text-muted-foreground">基于历史 K 线训练的专业 AI</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 md:p-6 rounded-xl hover:bg-card/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 text-green-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">风控优先</h3>
            <p className="text-sm text-muted-foreground">智能生成止盈止损位，保护您的本金</p>
          </div>
        </div>
      </main>
    </div>
  )
}
