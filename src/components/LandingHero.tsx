import { useI18n } from '../utils/i18n'
import Logo from './Logo'
import { ArrowRight } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface LandingHeroProps {
  onStart: () => void
}

export function LandingHero({ onStart }: LandingHeroProps) {
  const { t } = useI18n()

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 dark:opacity-5"></div>

      <div className="relative z-10 flex flex-col h-full">
         <header className="flex items-center justify-between p-4 md:p-6 max-w-7xl mx-auto w-full">
             <div className="flex items-center gap-2">
                 <Logo />
             </div>
             <ThemeToggle />
         </header>

         <main className="flex flex-1 flex-col items-center justify-center text-center p-4">
            <div className="max-w-3xl space-y-6 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                    {t('heroTitle')}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                    {t('heroSubtitle')}
                </p>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {t('heroDescription')}
                </p>
                <div className="pt-4">
                    <button
                        onClick={onStart}
                        className="btn-primary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
                    >
                        {t('heroButton')} <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                </div>

                <div className="mt-16 w-full max-w-5xl px-4 mx-auto animate-fade-in-up delay-200">
                    <img
                        src="/trading.gif"
                        alt="Trading Analysis"
                        className="rounded-xl shadow-2xl shadow-primary/10 w-full h-auto border border-border/50"
                    />
                </div>
            </div>
         </main>
      </div>
    </div>
  )
}

