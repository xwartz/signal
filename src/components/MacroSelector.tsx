import { useState } from 'react'
import { MACRO_SCENARIOS } from '../constants/macroScenarios'
import { useI18n } from '../utils/i18n'
import type { MacroScenario } from '../types'

interface MacroSelectorProps {
  onAnalyze: (scenarios: string[], period: string) => void
  disabled: boolean
}

export function MacroSelector({ onAnalyze, disabled }: MacroSelectorProps) {
  const { t } = useI18n()
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])
  const [period, setPeriod] = useState('1w')

  const toggleScenario = (id: string) => {
    setSelectedScenarios((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleAnalyze = () => {
    onAnalyze(selectedScenarios, period)
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {t('macroTitle')}
      </h2>

      <div className="space-y-6">
        {/* Period */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {t('macroPeriod')}
          </label>
          <div className="flex gap-2">
            {['1w', '2w', '1m'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  period === p
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t(p === '1w' ? 'period1w' : p === '2w' ? 'period2w' : 'period1m')}
              </button>
            ))}
          </div>
        </div>

        {/* Macro Scenarios */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {t('macroScenarios')}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {MACRO_SCENARIOS.scenarios.map((scenario: MacroScenario) => (
              <label
                key={scenario.id}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedScenarios.includes(scenario.id)
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedScenarios.includes(scenario.id)}
                  onChange={() => toggleScenario(scenario.id)}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{scenario.label}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        scenario.impact === 'positive'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {scenario.impact === 'positive' ? t('bullish') : t('bearish')}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={disabled}
          className="w-full btn-primary text-base py-3 font-semibold"
        >
          {t('analyzeButton')}
        </button>
      </div>
    </div>
  )
}
