import { useI18n } from '../utils/i18n'

export function LanguageToggle() {
  const { language, setLanguage } = useI18n()

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
      className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
      aria-label="Toggle language"
    >
      {language === 'en' ? '中文' : 'English'}
    </button>
  )
}
