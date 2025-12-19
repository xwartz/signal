import type { VercelRequest, VercelResponse } from '@vercel/node'
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  ImageAnalysisResponse,
  Binance24hrTicker,
  RealtimeData,
  TradingDecision,
} from './types'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 仅支持 POST 请求
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { image } = req.body as AnalyzeRequest

    if (!image) {
      return res.status(400).json({ error: "Image is required" })
    }

    // 第一步：多模态AI分析图片（包括技术指标识别）
    const imageAnalysis = await analyzeImageWithAI(image)

    // 第二步：获取实时市场数据（并行获取多个维度的真实数据）
    const [realtimeData, fundingRateData, openInterestData] = await Promise.all(
      [
        fetchBinanceSpotData(imageAnalysis.detected.symbol),
        fetchBinanceFundingRate(imageAnalysis.detected.symbol),
        fetchBinanceOpenInterest(imageAnalysis.detected.symbol),
      ]
    )

    // 第三步：生成智能交易决策（让 AI 自己检索市场情绪和宏观事件）
    const decision = await generateIntelligentDecision({
      imageAnalysis,
      realtimeData,
      fundingRateData,
      openInterestData,
    })

    const response: AnalyzeResponse = {
      detected: imageAnalysis.detected,
      analysis: imageAnalysis.analysis,
      realtime: realtimeData,
      decision,
    }

    return res.status(200).json(response)
  } catch (error) {
    console.error("Analysis error:", error)
    return res.status(500).json({
      error: "Analysis failed",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

// 多模态AI图像分析
async function analyzeImageWithAI(
  image: string
): Promise<ImageAnalysisResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("AI API key not configured")
  }

  const prompt = `你是专业的加密货币技术分析师。

这是一张 BTC 日线图，请识别并分析图中的所有信息：

【必须识别的信息】
1. 交易对（如 BTC/USDT）
2. 时间周期（如 1H, 4H, 1D）
3. 当前价格区间

【技术指标识别】（如果图中存在）
4. MACD 指标状态（金叉/死叉/趋势）
5. RSI 指标值和状态（超买/超卖/中性）
6. 布林带位置（价格在上轨/中轨/下轨，是否收窄）
7. 成交量趋势（放量/缩量/异常）

【技术分析】
8. 整体趋势判断（上涨/下跌/震荡）
9. 关键支撑位和压力位
10. 明显的技术形态（三角形、双顶、头肩等）
11. 市场状态（突破/回调/盘整）
12. 波动率水平

严格按照以下JSON格式输出：
{
  "detected": {
    "symbol": "BTCUSDT",
    "timeframe": "1D",
    "priceRange": "95000-105000"
  },
  "analysis": {
    "trend": "up",
    "indicators": {
      "macd": {
        "trend": "bullish",
        "signal": "金叉向上，动能增强"
      },
      "rsi": {
        "value": 65,
        "signal": "neutral"
      },
      "bollingerBands": {
        "position": "upper",
        "squeeze": false
      },
      "volume": {
        "trend": "increasing",
        "anomaly": false
      }
    },
    "support": ["95000附近", "92000附近"],
    "resistance": ["105000附近", "110000附近"],
    "pattern": "ascending_triangle",
    "marketState": "breakout",
    "volatility": "medium",
    "confidence": 0.85
  }
}

注意：
- 如果某个指标在图中不存在，该字段可以省略
- 价格和指标值可以是估算值
- confidence 反映图片清晰度和分析可信度`

  try {
    const apiUrl = process.env.OPENROUTER_API_KEY
      ? "https://openrouter.ai/api/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions"

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(process.env.OPENROUTER_API_KEY && {
          "HTTP-Referer": "https://signal-crypto.vercel.app",
          "X-Title": "Signal Trading Assistant",
        }),
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_API_KEY
          ? "anthropic/claude-3.5-sonnet"
          : "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // 提取JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response")
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error("AI analysis error:", error)
    throw new Error("Failed to analyze image with AI. Please try again.")
  }
}

// 获取币安现货实时数据
async function fetchBinanceSpotData(symbol: string): Promise<RealtimeData> {
  try {
    // 标准化symbol（移除斜杠和空格）
    const binanceSymbol = symbol.replace(/[\/\s]/g, "").toUpperCase()

    // 获取24h行情数据
    const tickerResponse = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`
    )

    if (!tickerResponse.ok) {
      throw new Error("Failed to fetch Binance data")
    }

    const ticker: Binance24hrTicker = await tickerResponse.json()

    return {
      currentPrice: parseFloat(ticker.lastPrice),
      priceChange24h: ticker.priceChangePercent,
      volume24h: ticker.volume,
    }
  } catch (error) {
    console.error("Binance API error:", error)
    throw new Error("Failed to fetch market data. Please try again.")
  }
}

// 获取币安合约资金费率（真实数据）
async function fetchBinanceFundingRate(symbol: string): Promise<{
  currentRate: number
  nextFundingTime: number
  recentRates: number[] // 最近8小时的资金费率
}> {
  try {
    const binanceSymbol = symbol.replace(/[\/\s]/g, "").toUpperCase()

    // 获取当前资金费率
    const fundingRateResponse = await fetch(
      `https://fapi.binance.com/fapi/v1/fundingRate?symbol=${binanceSymbol}&limit=8`
    )

    if (!fundingRateResponse.ok) {
      console.warn(`Funding rate unavailable for ${binanceSymbol}`)
      return {
        currentRate: 0,
        nextFundingTime: 0,
        recentRates: [],
      }
    }

    const fundingRates = await fundingRateResponse.json()

    // 获取下次资金费率结算时间
    const premiumIndexResponse = await fetch(
      `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${binanceSymbol}`
    )

    let nextFundingTime = 0
    if (premiumIndexResponse.ok) {
      const premiumData = await premiumIndexResponse.json()
      nextFundingTime = premiumData.nextFundingTime || 0
    }

    return {
      currentRate:
        fundingRates.length > 0 ? parseFloat(fundingRates[0].fundingRate) : 0,
      nextFundingTime,
      recentRates: fundingRates.map((r: any) => parseFloat(r.fundingRate)),
    }
  } catch (error) {
    console.error("Funding rate fetch error:", error)
    return {
      currentRate: 0,
      nextFundingTime: 0,
      recentRates: [],
    }
  }
}

// 获取币安合约持仓量（真实数据）
async function fetchBinanceOpenInterest(symbol: string): Promise<{
  openInterest: number
  openInterestValue: number
  timestamp: number
}> {
  try {
    const binanceSymbol = symbol.replace(/[\/\s]/g, "").toUpperCase()

    const response = await fetch(
      `https://fapi.binance.com/fapi/v1/openInterest?symbol=${binanceSymbol}`
    )

    if (!response.ok) {
      console.warn(`Open interest unavailable for ${binanceSymbol}`)
      return {
        openInterest: 0,
        openInterestValue: 0,
        timestamp: 0,
      }
    }

    const data = await response.json()

    return {
      openInterest: parseFloat(data.openInterest),
      openInterestValue:
        parseFloat(data.openInterest) * parseFloat(data.openInterest), // 简化计算
      timestamp: data.time,
    }
  } catch (error) {
    console.error("Open interest fetch error:", error)
    return {
      openInterest: 0,
      openInterestValue: 0,
      timestamp: 0,
    }
  }
}

// 生成智能交易决策
async function generateIntelligentDecision(params: {
  imageAnalysis: ImageAnalysisResponse
  realtimeData: RealtimeData
  fundingRateData: {
    currentRate: number
    nextFundingTime: number
    recentRates: number[]
  }
  openInterestData: {
    openInterest: number
    openInterestValue: number
    timestamp: number
  }
}): Promise<TradingDecision> {
  const { imageAnalysis, realtimeData, fundingRateData, openInterestData } =
    params

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("AI API key not configured")
  }

  // 计算资金费率趋势
  const avgFundingRate =
    fundingRateData.recentRates.length > 0
      ? fundingRateData.recentRates.reduce((a, b) => a + b, 0) /
        fundingRateData.recentRates.length
      : 0

  const fundingRateTrend =
    fundingRateData.currentRate > avgFundingRate ? "上升" : "下降"
  const marketSentiment =
    fundingRateData.currentRate > 0.0001
      ? "偏多头"
      : fundingRateData.currentRate < -0.0001
      ? "偏空头"
      : "中性"

  // 获取当前日期用于宏观事件判断
  const currentDate = new Date().toISOString().split("T")[0]
  const nextWeekDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]

  const prompt = `你是专业的加密货币交易顾问和量化分析师。当前日期是 ${currentDate}。

【图像技术分析结果】
${JSON.stringify(imageAnalysis, null, 2)}

【实时现货市场数据】
交易对: ${imageAnalysis.detected.symbol}
当前价格: $${realtimeData.currentPrice.toLocaleString()}
24h涨跌: ${realtimeData.priceChange24h}%
24h成交量: ${realtimeData.volume24h || "N/A"}

【合约市场数据 - 真实数据】
资金费率: ${(fundingRateData.currentRate * 100).toFixed(4)}% (当前)
平均资金费率: ${(avgFundingRate * 100).toFixed(4)}% (最近8小时平均)
资金费率趋势: ${fundingRateTrend}
市场多空偏好: ${marketSentiment}
持仓量: ${openInterestData.openInterest.toLocaleString()} ${imageAnalysis.detected.symbol.replace(
    "USDT",
    ""
  )}
持仓量价值: $${openInterestData.openInterestValue.toLocaleString()}

【资金费率解读】
- 正值且上升：多头需付费给空头，市场偏多，可能存在过热风险
- 负值且下降：空头需付费给多头，市场偏空，可能存在超卖机会
- 接近0：市场多空均衡

---

**请你完成以下任务：**

1. **检索下周宏观经济事件** (${currentDate} 至 ${nextWeekDate})
   - 美国重要经济数据发布（CPI、PPI、就业数据、GDP等）
   - 美联储官员讲话或会议
   - BTC/加密货币相关重大事件（ETF资金流报告、监管政策等）
   - 根据你的知识库和当前时间推断可能发生的事件

2. **分析市场情绪**
   - 基于资金费率判断当前市场情绪（多头/空头倾向）
   - 结合持仓量变化判断市场参与度
   - 考虑社交媒体和加密社区的一般情绪趋势
   - 评估市场恐慌/贪婪程度

3. **生成交易决策**
   - 综合技术面、资金面、情绪面、宏观面判断涨跌概率
   - 提供现货、合约、期权三个维度的操作建议
   - 所有价格建议必须基于当前实时价格 $${realtimeData.currentPrice.toLocaleString()}

严格按照以下JSON格式输出：
{
  "macroEvents": [
    {
      "date": "2024-12-21",
      "event": "美国11月CPI数据公布",
      "importance": "high",
      "expectedImpact": "若CPI超预期，美联储可能维持高利率，对BTC构成压力"
    },
    {
      "date": "2024-12-23",
      "event": "BTC现货ETF周度资金流报告",
      "importance": "high",
      "expectedImpact": "持续流入将提供价格支撑"
    }
  ],
  "probability": {
    "bullish": 55,
    "bearish": 25,
    "neutral": 20,
    "reasoning": "技术面：上升趋势+MACD金叉(30%)；资金面：资金费率${marketSentiment}+持仓量适中(25%)；情绪面：市场情绪${marketSentiment}(15%)；宏观面：下周CPI数据不确定性(30%)。综合判断上涨概率略高但需警惕宏观风险。"
  },
  "spot": {
    "action": "分批建仓/持有/减仓",
    "priceZone": "回调至 $XX,XXX-$XX,XXX 时分批买入",
    "logic": "基于技术支撑位和当前市场状态的建仓逻辑"
  },
  "futures": {
    "bias": "long/short/neutral",
    "entry": "具体入场点位",
    "stopLoss": "具体止损点位",
    "riskReward": "1:2 或 1:3"
  },
  "options": {
    "strategy": "具体期权策略",
    "logic": "基于波动率和市场预期的策略逻辑"
  },
  "reasoning": "综合判断依据：详细说明各维度分析结果如何影响最终决策，包括权重分配和风险考量。"
}`

  try {
    const apiUrl = process.env.OPENROUTER_API_KEY
      ? "https://openrouter.ai/api/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions"

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(process.env.OPENROUTER_API_KEY && {
          "HTTP-Referer": "https://signal-crypto.vercel.app",
          "X-Title": "Signal Trading Assistant",
        }),
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_API_KEY
          ? "anthropic/claude-3.5-sonnet"
          : "gpt-4-turbo-preview",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 2500,
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response")
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error("Decision generation error:", error)
    throw new Error("Failed to generate trading decision. Please try again.")
  }
}
