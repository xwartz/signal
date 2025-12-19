import { Link } from "react-router-dom"
import { cn } from "../lib/utils"
import { useI18n } from '../utils/i18n'

const LogoIcon = () => (
    <div className="relative w-8 h-8">
        <img
            src="/logo.png"
            alt="Logo"
            className="w-full h-full object-contain"
        />
    </div>
);


export default function Logo({ className }: { className?: string }) {
  const { t } = useI18n()
  return (
    <Link to="/" className={cn("flex items-center gap-2 hover:opacity-80 transition-opacity", className)}>
        <LogoIcon />
      <h2 className="text-lg font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
        {t('title')}
      </h2>
    </Link>
  );
}
