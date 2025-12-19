import { useI18n } from '../utils/i18n'
import type { AnalyzeResponse } from '../types'

interface ResultCardsProps {
  result: AnalyzeResponse
}

export function ResultCards({ result }: ResultCardsProps) {
  const { t } = useI18n()
  const { detected, analysis, realtime, decision } = result

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg font-semibold mt-1 mb-3 md:mb-4 text-gray-900 dark:text-gray-100">
        {t("resultsTitle")}
      </h2>

      {/* AI 识别结果 */}
      <div className="card">
        <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
          {t("detection")}
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {detected.symbol}
          </span>
          <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {detected.timeframe}
          </span>
          <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {detected.priceRange}
          </span>
          <span
            className={`inline-flex items-center px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium ${
              analysis.confidence >= 0.7
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : analysis.confidence >= 0.5
                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }`}
          >
            {t('confidence')}: {(analysis.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* 技术分析 */}
      <div className="card">
        <h3 className="text-base font-semibold mb-3 md:mb-4 text-gray-800 dark:text-gray-200">
          {t('technicalAnalysis')}
        </h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
              {t('trend')}
            </p>
            <p className="font-semibold text-sm md:text-base">
              {analysis.trend === "up"
                ? "↑ 上涨"
                : analysis.trend === "down"
                ? "↓ 下跌"
                : "↔ 震荡"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
              {t('marketState')}
            </p>
            <p className="font-semibold text-sm md:text-base">
              {analysis.marketState === "breakout"
                ? "突破"
                : analysis.marketState === "pullback"
                ? "回调"
                : "盘整"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
              {t('volatility')}
            </p>
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                analysis.volatility === "high"
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  : analysis.volatility === "medium"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                  : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              }`}
            >
              {analysis.volatility === "high"
                ? "高"
                : analysis.volatility === "medium"
                ? "中"
                : "低"}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
              {t('currentPrice')}
            </p>
            <p className="font-semibold text-sm md:text-base">
              ${realtime.currentPrice.toLocaleString()}{" "}
              <span
                className={`text-xs md:text-sm ${
                  parseFloat(realtime.priceChange24h) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ({parseFloat(realtime.priceChange24h) >= 0 ? "+" : ""}
                {realtime.priceChange24h}%)
              </span>
            </p>
          </div>
        </div>

        {/* 技术指标 */}
        {analysis.indicators && (
          <div className="mt-4 grid grid-cols-2 gap-3 md:gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            {analysis.indicators.macd && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  MACD
                </p>
                <p className="font-medium text-xs md:text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                  {analysis.indicators.macd.signal}
                </p>
              </div>
            )}
            {analysis.indicators.rsi && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  RSI
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm md:text-base">
                    {analysis.indicators.rsi.value}
                  </span>
                  <span
                    className={`inline-flex items-center px-1.5 md:px-2 py-0.5 rounded text-xs font-medium ${
                      analysis.indicators.rsi.signal === "overbought"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        : analysis.indicators.rsi.signal === "oversold"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {analysis.indicators.rsi.signal === "overbought"
                      ? "超买"
                      : analysis.indicators.rsi.signal === "oversold"
                      ? "超卖"
                      : "中性"}
                  </span>
                </div>
              </div>
            )}
            {analysis.indicators.bollingerBands && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  {t('resistanceLevels').split('压力位')[0] || '布林带'}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-1.5 md:px-2 py-0.5 rounded text-xs font-medium ${
                      analysis.indicators.bollingerBands.position === "upper"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        : analysis.indicators.bollingerBands.position === "lower"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {analysis.indicators.bollingerBands.position === "upper"
                      ? "上轨"
                      : analysis.indicators.bollingerBands.position === "lower"
                      ? "下轨"
                      : "中轨"}
                  </span>
                  {analysis.indicators.bollingerBands.squeeze && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                      (收窄)
                    </span>
                  )}
                </div>
              </div>
            )}
            {analysis.indicators.volume && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  {t('volatility').split('波动率')[0] || '成交量'}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-1.5 md:px-2 py-0.5 rounded text-xs font-medium ${
                      analysis.indicators.volume.trend === "increasing"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : analysis.indicators.volume.trend === "decreasing"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {analysis.indicators.volume.trend === "increasing"
                      ? "放量"
                      : analysis.indicators.volume.trend === "decreasing"
                      ? "缩量"
                      : "稳定"}
                  </span>
                  {analysis.indicators.volume.anomaly && (
                    <span className="text-xs text-red-500 font-medium">
                      ! 异常
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              {t('supportLevels')}
            </p>
            <div className="flex flex-wrap gap-1">
              {analysis.support.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              {t('resistanceLevels')}
            </p>
            <div className="flex flex-wrap gap-1">
              {analysis.resistance.map((r, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {analysis.pattern && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              {t("pattern")}
            </p>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {analysis.pattern}
            </span>
          </div>
        )}
      </div>

      {/* 下周宏观事件 */}
      {decision.macroEvents && decision.macroEvents.length > 0 && (
        <div className="card">
          <h3 className="text-base font-semibold mb-3 md:mb-4 text-gray-800 dark:text-gray-200">
            {t('macroEvents')}
          </h3>
          <div className="space-y-3">
            {decision.macroEvents.map((event, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  event.importance === "high"
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    : event.importance === "medium"
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                        {event.date}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          event.importance === "high"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            : event.importance === "medium"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {event.importance.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {event.event}
                    </p>
                    {event.expectedImpact && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {event.expectedImpact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 概率分布 */}
      {decision.probability && (
        <div className="card">
          <h3 className="text-base font-semibold mb-3 md:mb-4 text-gray-800 dark:text-gray-200">
            {t('probabilityTitle')}
          </h3>
          <div className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  ↑ {t('probUp')}
                </span>
                <span className="font-bold text-lg">
                  {decision.probability.bullish}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 md:h-3">
                <div
                  className="bg-green-500 h-2 md:h-3 rounded-full transition-all"
                  style={{ width: `${decision.probability.bullish}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600 dark:text-red-400 font-medium">
                  ↓ {t('probDown')}
                </span>
                <span className="font-bold text-lg">
                  {decision.probability.bearish}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 md:h-3">
                <div
                  className="bg-red-500 h-2 md:h-3 rounded-full transition-all"
                  style={{ width: `${decision.probability.bearish}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  ↔ {t('probSideways')}
                </span>
                <span className="font-bold text-lg">
                  {decision.probability.neutral}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 md:h-3">
                <div
                  className="bg-gray-500 h-2 md:h-3 rounded-full transition-all"
                  style={{ width: `${decision.probability.neutral}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-900 dark:text-blue-100 leading-relaxed">
                <span className="font-semibold">{t('probReasoning')}：</span>
                {decision.probability.reasoning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 操作建议 */}
      <div className="card">
        <h3 className="text-base font-semibold mb-3 md:mb-4 text-gray-800 dark:text-gray-200">
          {t('tradingRecommendations')}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* 现货 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 flex flex-col h-full">
            <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100 flex items-center justify-between">
              {t('spot')}
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800/50 rounded text-blue-700 dark:text-blue-200">
                {decision.spot.action}
              </span>
            </h4>
            <div className="space-y-2 flex-grow">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400 block text-xs">
                  价格区间
                </span>
                <span className="font-mono font-medium text-primary-600 dark:text-primary-400">
                  {decision.spot.priceZone}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-2 pt-2 border-t border-blue-100 dark:border-blue-800/50">
                {decision.spot.logic}
              </p>
            </div>
          </div>

          {/* 永续合约 */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                {t('futures')}
              </h4>
              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  decision.futures.bias === "long"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : decision.futures.bias === "short"
                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {decision.futures.bias === "long"
                  ? "做多"
                  : decision.futures.bias === "short"
                  ? "做空"
                  : "中性"}
              </span>
            </div>
            <div className="space-y-3 flex-grow">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block text-xs">
                    入场
                  </span>
                  <span className="font-medium">{decision.futures.entry}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block text-xs">
                    止损
                  </span>
                  <span className="font-medium">
                    {decision.futures.stopLoss}
                  </span>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400 block text-xs">
                  盈亏比
                </span>
                <span className="font-medium">
                  {decision.futures.riskReward}
                </span>
              </div>
            </div>
          </div>

          {/* 期权 */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 flex flex-col h-full">
            <h4 className="font-semibold mb-3 text-amber-900 dark:text-amber-100">
              {t('options')}
            </h4>
            <div className="space-y-2 flex-grow">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400 block text-xs">
                  策略
                </span>
                <span className="font-medium">{decision.options.strategy}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-2 pt-2 border-t border-amber-100 dark:border-amber-800/50">
                {decision.options.logic}
              </p>
            </div>
          </div>
        </div>

        {/* 综合判断依据 */}
        {decision.reasoning && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 text-sm">
              {t('generalReasoning')}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {decision.reasoning}
            </p>
          </div>
        )}
      </div>

      {/* 免责声明 */}
      <div className="card border-l-4 border-amber-500">
        <h3 className="text-base font-semibold mb-3 text-amber-600 dark:text-amber-400">
          {t('riskWarnings')}
        </h3>
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </div>
  )
}
