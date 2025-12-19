import { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'en' | 'zh'

const translations = {
  en: {
    // Header
    title: 'Signal',
    subtitle: 'AI-Powered Crypto Trading Assistant',

    // Intro
    introTitle: 'Professional Trading Analysis',
    introDescription: 'Upload your chart screenshot, and our multimodal AI will automatically analyze technical patterns, combine with macro scenarios, and generate comprehensive trading recommendations for spot, futures, and options.',
    featureImageRecognition: 'Image Recognition',
    featureRealtimeData: 'Real-time Data',
    featureMultiStrategy: 'Multi-Strategy',

    // Upload
    uploadTitle: 'Upload Chart',
    uploadDrop: 'Drop your chart here',
    uploadBrowse: 'or click to browse / paste screenshot (Ctrl+V / Cmd+V)',
    uploadFormat: 'PNG, JPG up to 5MB',
    uploadReplace: 'Replace',
    uploadTips: 'Best results with charts showing trading pair name, timeframe, and sufficient candle data.',
    uploadAlert: 'Please upload a chart first',

    // Macro Selector
    macroTitle: 'Analysis Configuration',
    macroPeriod: 'Analysis Period',
    macroScenarios: 'Macro Scenarios (Optional)',
    period1w: '1 Week',
    period2w: '2 Weeks',
    period1m: '1 Month',
    bullish: 'Bullish',
    bearish: 'Bearish',
    analyzeButton: 'Start Analysis',

    // Loading
    analyzing: 'Analyzing...',
    analyzingDesc: 'Processing chart and generating recommendations',

    // Error
    errorTitle: 'Analysis Failed',

    // Results
    resultsTitle: 'Analysis Results',
    detection: 'Detection',
    confidence: 'Confidence',
    technicalAnalysis: 'Technical Analysis',
    trend: 'Trend',
    trendUp: 'Uptrend',
    trendDown: 'Downtrend',
    trendSideways: 'Sideways',
    marketState: 'Market State',
    stateBreakout: 'Breakout',
    statePullback: 'Pullback',
    stateConsolidation: 'Consolidation',
    volatility: 'Volatility',
    volatilityHigh: 'High',
    volatilityMedium: 'Medium',
    volatilityLow: 'Low',
    currentPrice: 'Current Price',
    supportLevels: 'Support Levels',
    resistanceLevels: 'Resistance Levels',
    pattern: 'Pattern',

    // Trading Recommendations
    tradingRecommendations: 'Trading Recommendations',
    spot: 'Spot',
    futures: 'Futures',
    options: 'Options',
    action: 'Action',
    priceZone: 'Price Zone',
    entry: 'Entry',
    stopLoss: 'Stop Loss',
    riskReward: 'Risk/Reward',
    strategy: 'Strategy',
    priceForecast: 'Price Forecast',
    biasLong: 'Long',
    biasShort: 'Short',
    biasNeutral: 'Neutral',

    // Risk Warnings
    riskWarnings: 'Risk Warnings',
    disclaimer: 'This analysis is for educational purposes only and does not constitute financial advice. Cryptocurrency trading involves high risk. Make decisions based on your own risk tolerance.',

    // Footer
    footerDisclaimer: 'Disclaimer: For educational purposes only. Not financial advice. Cryptocurrency trading involves high risk.',
  },
  zh: {
    // Header
    title: 'Signal',
    subtitle: 'AI 加密货币交易决策系统',

    // Intro
    introTitle: '专业交易分析',
    introDescription: '上传K线截图，多模态AI自动识别技术形态，结合宏观场景，生成现货、合约、期权的综合交易建议。',
    featureImageRecognition: '图像识别',
    featureRealtimeData: '实时数据',
    featureMultiStrategy: '多策略建议',

    // Upload
    uploadTitle: '上传图表',
    uploadDrop: '拖放图片到这里',
    uploadBrowse: '或点击选择文件 / 粘贴截图 (Ctrl+V / Cmd+V)',
    uploadFormat: 'PNG, JPG 最大 5MB',
    uploadReplace: '重新上传',
    uploadTips: '建议截图包含交易对名称、时间周期和足够的K线数据。',
    uploadAlert: '请先上传K线截图',

    // Macro Selector
    macroTitle: '分析配置',
    macroPeriod: '分析周期',
    macroScenarios: '宏观场景（可选）',
    period1w: '1周',
    period2w: '2周',
    period1m: '1个月',
    bullish: '利好',
    bearish: '利空',
    analyzeButton: '开始分析',

    // Loading
    analyzing: '分析中...',
    analyzingDesc: '正在识别图表并生成交易建议',

    // Error
    errorTitle: '分析失败',

    // Results
    resultsTitle: '分析结果',
    detection: '识别结果',
    confidence: '置信度',
    technicalAnalysis: '技术分析',
    trend: '趋势',
    trendUp: '上涨',
    trendDown: '下跌',
    trendSideways: '震荡',
    marketState: '市场状态',
    stateBreakout: '突破',
    statePullback: '回调',
    stateConsolidation: '盘整',
    volatility: '波动率',
    volatilityHigh: '高',
    volatilityMedium: '中',
    volatilityLow: '低',
    currentPrice: '当前价格',
    supportLevels: '支撑位',
    resistanceLevels: '压力位',
    pattern: '技术形态',

    // Trading Recommendations
    tradingRecommendations: '交易建议',
    spot: '现货',
    futures: '合约',
    options: '期权',
    action: '操作',
    priceZone: '价格区间',
    entry: '入场点',
    stopLoss: '止损',
    riskReward: '风险回报',
    strategy: '策略',
    priceForecast: '价格预期',
    biasLong: '做多',
    biasShort: '做空',
    biasNeutral: '中性',

    // Risk Warnings
    riskWarnings: '风险提示',
    disclaimer: '本分析仅供学习参考，不构成投资建议。加密货币投资存在高风险，请根据自身风险承受能力谨慎决策。',

    // Footer
    footerDisclaimer: '免责声明：本系统仅供学习参考，不构成投资建议。加密货币投资存在高风险。',
  },
}

type TranslationKey = keyof typeof translations.en

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const getStoredLanguage = (): Language => {
  const stored = localStorage.getItem('language')
  if (stored === 'en' || stored === 'zh') {
    return stored
  }
  // Detect browser language
  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('zh') ? 'zh' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage)

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
