import { useI18n } from '../utils/i18n'
import type { AnalyzeResponse } from '../types'

interface ResultCardsProps {
  result: AnalyzeResponse
}

export function ResultCards({ result }: ResultCardsProps) {
  const { t } = useI18n()
  const { detected, analysis, realtime, decision } = result

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {t('resultsTitle')}
      </h2>

      {/* AI识别结果 */}
      <div className="card">
        <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
          {t('detection')}
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {detected.symbol}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {detected.timeframe}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {detected.priceRange}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
              analysis.confidence >= 0.7
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : analysis.confidence >= 0.5
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}
          >
            Confidence: {(analysis.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* 技术分析 */}
      <div className="card">
        <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Technical Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Trend</p>
            <p className="font-semibold text-base">
              {analysis.trend === 'up' ? '↑ Uptrend' : analysis.trend === 'down' ? '↓ Downtrend' : '↔ Sideways'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Market State</p>
            <p className="font-semibold text-base">
              {analysis.marketState === 'breakout' ? 'Breakout' : analysis.marketState === 'pullback' ? 'Pullback' : 'Consolidation'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Volatility</p>
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                analysis.volatility === 'high'
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  : analysis.volatility === 'medium'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              }`}
            >
              {analysis.volatility === 'high' ? 'High' : analysis.volatility === 'medium' ? 'Medium' : 'Low'}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Current Price</p>
            <p className="font-semibold text-base">
              ${realtime.currentPrice.toLocaleString()}{' '}
              <span
                className={
                  realtime.priceChange24h.startsWith('+')
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                ({realtime.priceChange24h})
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Support Levels</p>
            <div className="flex flex-wrap gap-1">
              {analysis.support.map((s, i) => (
                <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Resistance Levels</p>
            <div className="flex flex-wrap gap-1">
              {analysis.resistance.map((r, i) => (
                <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {analysis.pattern && (
          <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">{t('pattern')}</p>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{analysis.pattern}</span>
          </div>
        )}
      </div>

      {/* 交易建议 */}
      <div className="card">
        <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Trading Recommendations
        </h3>

        <div className="space-y-4">
          {/* 现货 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Spot</h4>
            <p className="text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Action:</span>{' '}
              <span className="font-medium">{decision.spot.action}</span>
            </p>
            <p className="text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Price Zone:</span>{' '}
              <span className="font-mono font-medium text-primary-600 dark:text-primary-400">
                {decision.spot.priceZone}
              </span>
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {decision.spot.logic}
            </p>
          </div>

          {/* 合约 */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">Futures</h4>
              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  decision.futures.bias === 'long'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : decision.futures.bias === 'short'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {decision.futures.bias === 'long' ? 'Long' : decision.futures.bias === 'short' ? 'Short' : 'Neutral'}
              </span>
            </div>
            <p className="text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Entry:</span>{' '}
              <span className="font-medium">{decision.futures.entry}</span>
            </p>
            <p className="text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Stop Loss:</span>{' '}
              <span className="font-medium">{decision.futures.stopLoss}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Risk/Reward:</span>{' '}
              <span className="font-medium">{decision.futures.riskReward}</span>
            </p>
          </div>

          {/* 期权 */}
          {decision.options && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold mb-3 text-amber-900 dark:text-amber-100">{t('options')}</h4>
                <p className="text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">{t('strategy')}:</span>{' '}
                <span className="font-medium">{decision.options.strategy}</span>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {decision.options.logic}
              </p>
            </div>
          )}

          {/* 价格预期 */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-2 text-green-900 dark:text-green-100">{t('priceForecast')}</h4>
            <p className="font-mono text-lg font-medium text-green-700 dark:text-green-300">
              {decision.priceRange}
            </p>
          </div>
        </div>
      </div>

      {/* 风险提示 */}
      <div className="card border-l-4 border-red-500">
        <h3 className="text-base font-semibold mb-3 text-red-600 dark:text-red-400">
          Risk Warnings
        </h3>
        <ul className="space-y-2">
          {decision.risks.map((risk, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-red-500 mt-0.5">•</span>
              <span className="text-gray-700 dark:text-gray-300">{risk}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-800 dark:text-red-200 leading-relaxed">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </div>
  )
}
