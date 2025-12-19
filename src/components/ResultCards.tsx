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
      <h2 className="text-lg font-semibold mt-1 mb-3 md:mb-4 text-foreground">
        {t("resultsTitle")}
      </h2>

      {/* AI 识别结果 */}
      <div className="card">
        <h3 className="text-base font-semibold mb-3 text-foreground">
          {t("detection")}
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium bg-muted text-foreground">
            {detected.symbol}
          </span>
          <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium bg-muted text-foreground">
            {detected.timeframe}
          </span>
          <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium bg-muted text-foreground">
            {detected.priceRange}
          </span>
          <span
            className={`inline-flex items-center px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium ${
              analysis.confidence >= 0.7
                ? "bg-success/20 text-success"
                : analysis.confidence >= 0.5
                ? "bg-warning/20 text-warning"
                : "bg-danger/20 text-danger"
            }`}
          >
            {t('confidence')}: {(analysis.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* 技术分析 */}
      <div className="card">
        <h3 className="text-base font-semibold mb-3 md:mb-4 text-foreground">
          {t('technicalAnalysis')}
        </h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
              {t('trend')}
            </p>
            <p className="font-semibold text-sm md:text-base text-foreground">
              {analysis.trend === "up"
                ? "↑ 上涨"
                : analysis.trend === "down"
                ? "↓ 下跌"
                : "↔ 震荡"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
              {t('marketState')}
            </p>
            <p className="font-semibold text-sm md:text-base text-foreground">
              {analysis.marketState === "breakout"
                ? "突破"
                : analysis.marketState === "pullback"
                ? "回调"
                : "盘整"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
              {t('volatility')}
            </p>
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                analysis.volatility === "high"
                  ? "bg-danger/20 text-danger"
                  : analysis.volatility === "medium"
                  ? "bg-warning/20 text-warning"
                  : "bg-success/20 text-success"
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
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
              {t('currentPrice')}
            </p>
            <p className="font-semibold text-sm md:text-base text-foreground">
              ${realtime.currentPrice.toLocaleString()}{" "}
              <span
                className={`text-xs md:text-sm ${
                  parseFloat(realtime.priceChange24h) >= 0
                    ? "text-success"
                    : "text-danger"
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
          <div className="mt-4 grid grid-cols-2 gap-3 md:gap-4 border-t border-border pt-4">
            {analysis.indicators.macd && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                  MACD
                </p>
                <p className="font-medium text-xs md:text-sm text-foreground line-clamp-2">
                  {analysis.indicators.macd.signal}
                </p>
              </div>
            )}
            {analysis.indicators.rsi && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                  RSI
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm md:text-base text-foreground">
                    {analysis.indicators.rsi.value}
                  </span>
                  <span
                    className={`inline-flex items-center px-1.5 md:px-2 py-0.5 rounded text-xs font-medium ${
                      analysis.indicators.rsi.signal === "overbought"
                        ? "bg-danger/20 text-danger"
                        : analysis.indicators.rsi.signal === "oversold"
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
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
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                  {t('resistanceLevels').split('压力位')[0] || '布林带'}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-1.5 md:px-2 py-0.5 rounded text-xs font-medium ${
                      analysis.indicators.bollingerBands.position === "upper"
                        ? "bg-danger/20 text-danger"
                        : analysis.indicators.bollingerBands.position === "lower"
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {analysis.indicators.bollingerBands.position === "upper"
                      ? "上轨"
                      : analysis.indicators.bollingerBands.position === "lower"
                      ? "下轨"
                      : "中轨"}
                  </span>
                  {analysis.indicators.bollingerBands.squeeze && (
                    <span className="text-xs text-warning font-medium">
                      (收窄)
                    </span>
                  )}
                </div>
              </div>
            )}
            {analysis.indicators.volume && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                  {t('volatility').split('波动率')[0] || '成交量'}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-1.5 md:px-2 py-0.5 rounded text-xs font-medium ${
                      analysis.indicators.volume.trend === "increasing"
                        ? "bg-success/20 text-success"
                        : analysis.indicators.volume.trend === "decreasing"
                        ? "bg-danger/20 text-danger"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {analysis.indicators.volume.trend === "increasing"
                      ? "放量"
                      : analysis.indicators.volume.trend === "decreasing"
                      ? "缩量"
                      : "稳定"}
                  </span>
                  {analysis.indicators.volume.anomaly && (
                    <span className="text-xs text-danger font-medium">
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
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              {t('supportLevels')}
            </p>
            <div className="flex flex-wrap gap-1">
              {analysis.support.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-success/20 text-success"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              {t('resistanceLevels')}
            </p>
            <div className="flex flex-wrap gap-1">
              {analysis.resistance.map((r, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-danger/20 text-danger"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {analysis.pattern && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              {t("pattern")}
            </p>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted text-foreground">
              {analysis.pattern}
            </span>
          </div>
        )}
      </div>

      {/* 下周宏观事件 */}
      {decision.macroEvents && decision.macroEvents.length > 0 && (
        <div className="card">
          <h3 className="text-base font-semibold mb-3 md:mb-4 text-foreground">
            {t('macroEvents')}
          </h3>
          <div className="space-y-3">
            {decision.macroEvents.map((event, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  event.importance === "high"
                    ? "bg-danger/10 border-danger/30"
                    : event.importance === "medium"
                    ? "bg-warning/10 border-warning/30"
                    : "bg-muted border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {event.date}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          event.importance === "high"
                            ? "bg-danger/20 text-danger"
                            : event.importance === "medium"
                            ? "bg-warning/20 text-warning"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {event.importance.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {event.event}
                    </p>
                    {event.expectedImpact && (
                      <p className="text-xs text-muted-foreground">
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
          <h3 className="text-base font-semibold mb-3 md:mb-4 text-foreground">
            {t('probabilityTitle')}
          </h3>
          <div className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-success font-medium">
                  ↑ {t('probUp')}
                </span>
                <span className="font-bold text-lg text-foreground">
                  {decision.probability.bullish}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 md:h-3">
                <div
                  className="bg-success h-2 md:h-3 rounded-full transition-all"
                  style={{ width: `${decision.probability.bullish}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-danger font-medium">
                  ↓ {t('probDown')}
                </span>
                <span className="font-bold text-lg text-foreground">
                  {decision.probability.bearish}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 md:h-3">
                <div
                  className="bg-danger h-2 md:h-3 rounded-full transition-all"
                  style={{ width: `${decision.probability.bearish}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  ↔ {t('probSideways')}
                </span>
                <span className="font-bold text-lg text-foreground">
                  {decision.probability.neutral}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 md:h-3">
                <div
                  className="bg-muted-foreground h-2 md:h-3 rounded-full transition-all"
                  style={{ width: `${decision.probability.neutral}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-foreground leading-relaxed">
                <span className="font-semibold">{t('probReasoning')}：</span>
                {decision.probability.reasoning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 操作建议 */}
      <div className="card">
        <h3 className="text-base font-semibold mb-3 md:mb-4 text-foreground">
          {t('tradingRecommendations')}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* 现货 */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 flex flex-col h-full">
            <h4 className="font-semibold mb-3 text-foreground flex items-center justify-between">
              {t('spot')}
              <span className="text-xs px-2 py-1 bg-primary/20 rounded text-primary">
                {decision.spot.action}
              </span>
            </h4>
            <div className="space-y-2 flex-grow">
              <div className="text-sm">
                <span className="text-muted-foreground block text-xs">
                  价格区间
                </span>
                <span className="font-mono font-medium text-primary">
                  {decision.spot.priceZone}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2 pt-2 border-t border-primary/20">
                {decision.spot.logic}
              </p>
            </div>
          </div>

          {/* 永续合约 */}
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">
                {t('futures')}
              </h4>
              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  decision.futures.bias === "long"
                    ? "bg-success/20 text-success"
                    : decision.futures.bias === "short"
                    ? "bg-danger/20 text-danger"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {decision.futures.bias === "long"
                  ? "做多"
                  : decision.futures.bias === "short"
                  ? "做空"
                  : "中性"}
              </span>
            </div>
            <div className="space-y-2 flex-grow text-sm">
              <div>
                <span className="text-muted-foreground text-xs">入场</span>
                <p className="font-medium text-foreground break-words">{decision.futures.entry}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">止损</span>
                <p className="font-medium text-foreground break-words">{decision.futures.stopLoss}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">盈亏比</span>
                <p className="font-medium text-foreground">{decision.futures.riskReward}</p>
              </div>
            </div>
          </div>

          {/* 期权 */}
          <div className="p-4 bg-warning/10 rounded-lg border border-warning/20 flex flex-col h-full">
            <h4 className="font-semibold mb-3 text-foreground">
              {t('options')}
            </h4>
            <div className="space-y-2 flex-grow">
              <div className="text-sm">
                <span className="text-muted-foreground block text-xs">
                  策略
                </span>
                <span className="font-medium text-foreground">{decision.options.strategy}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2 pt-2 border-t border-warning/20">
                {decision.options.logic}
              </p>
            </div>
          </div>
        </div>

        {/* 综合判断依据 */}
        {decision.reasoning && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2 text-foreground text-sm">
              {t('generalReasoning')}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {decision.reasoning}
            </p>
          </div>
        )}
      </div>

      {/* 免责声明 */}
      <div className="card border-l-4 border-warning">
        <h3 className="text-base font-semibold mb-3 text-warning">
          {t('riskWarnings')}
        </h3>
        <div className="p-3 bg-warning/10 rounded border border-warning/20">
          <p className="text-sm text-foreground leading-relaxed">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </div>
  )
}
