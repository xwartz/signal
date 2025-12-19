// 基础类型定义
export type Trend = 'up' | 'down' | 'range'
export type MarketState = 'breakout' | 'pullback' | 'range'
export type Volatility = 'low' | 'medium' | 'high'
export type Bias = 'long' | 'short' | 'neutral'
export type RiskBias = 'risk-on' | 'risk-off' | 'neutral'
export type Impact = 'positive' | 'negative' | 'uncertain'

// 宏观情景
export interface MacroScenario {
  id: string
  label: string
  bias: RiskBias
  impact: Impact
}

// AI识别结果
export interface DetectedInfo {
  symbol: string
  timeframe: string
  priceRange: string
}

// 技术分析结果
export interface TechnicalAnalysis {
  trend: Trend
  support: string[]
  resistance: string[]
  pattern?: string
  marketState: MarketState
  volatility: Volatility
  confidence: number
}

// 实时市场数据
export interface RealtimeData {
  currentPrice: number
  priceChange24h: string
  volume24h?: string
}

// 现货建议
export interface SpotAdvice {
  action: string
  priceZone: string
  logic: string
}

// 合约建议
export interface FuturesAdvice {
  bias: Bias
  entry: string
  stopLoss: string
  riskReward: string
}

// 期权建议
export interface OptionsAdvice {
  strategy: string
  logic: string
}

// 交易决策
export interface TradingDecision {
  spot: SpotAdvice
  futures: FuturesAdvice
  options?: OptionsAdvice
  priceRange: string
  risks: string[]
}

// 分析请求
export interface AnalyzeRequest {
  image: string // base64
  macroScenarios: string[]
  period: string
}

// 分析响应
export interface AnalyzeResponse {
  detected: DetectedInfo
  analysis: TechnicalAnalysis
  realtime: RealtimeData
  decision: TradingDecision
}

// 图像分析响应（内部使用）
export interface ImageAnalysisResponse {
  detected: DetectedInfo
  analysis: TechnicalAnalysis
}

// 币安K线数据
export type BinanceKline = [
  number, // 开盘时间
  string, // 开盘价
  string, // 最高价
  string, // 最低价
  string, // 收盘价
  string, // 成交量
  number, // 收盘时间
  string, // 成交额
  number, // 成交笔数
  string, // 主动买入成交量
  string, // 主动买入成交额
  string  // 忽略
]

// 币安24h行情数据
export interface Binance24hrTicker {
  symbol: string
  priceChange: string
  priceChangePercent: string
  lastPrice: string
  volume: string
}
