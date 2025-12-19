import type {
  AnalyzeResponse,
  ImageAnalysisResponse,
  RealtimeData,
  TradingDecision,
} from '../types'

// 开发环境的分析函数（客户端运行）
export async function analyzeImage(
  image: string,
  macroScenarios: string[],
  period: string
): Promise<AnalyzeResponse> {
  try {
    // Step 1: AI image analysis
    const imageAnalysis = await analyzeImageWithAI(image)

    // Step 2: Fetch real-time market data
    const realtimeData = await fetchBinanceData(imageAnalysis.detected.symbol)

    // Step 3: Generate trading decision
    const decision = await generateDecision({
      imageAnalysis,
      realtimeData,
      macroScenarios,
      period,
    })

    return {
      detected: imageAnalysis.detected,
      analysis: imageAnalysis.analysis,
      realtime: realtimeData,
      decision,
    }
  } catch (error) {
    console.error('Analysis error:', error)
    throw error
  }
}

// Multimodal AI image analysis
async function analyzeImageWithAI(image: string): Promise<ImageAnalysisResponse> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('AI API key not configured. Please set VITE_OPENROUTER_API_KEY or VITE_OPENAI_API_KEY.')
  }

  const prompt = `You are a professional cryptocurrency technical analyst.

Analyze this candlestick chart screenshot and complete the following tasks:

[Detection]
1. Identify trading pair (e.g., BTC/USDT, ETH/USDT)
2. Identify timeframe (e.g., 1H, 4H, 1D)
3. Identify current price range

[Technical Analysis]
4. Determine overall trend (up/down/sideways)
5. Identify key support and resistance levels
6. Identify significant patterns (triangles, double tops, head & shoulders, etc.)
7. Determine market state (breakout/pullback/consolidation)
8. Assess volatility level

[Important]
- Analyze only visible content in the image
- Price levels can be approximate ranges
- 如果图片模糊或信息不全，请在confidence中体现

严格按照以下JSON格式输出：
{
  "detected": {
    "symbol": "BTCUSDT",
    "timeframe": "4H",
    "priceRange": "64000-72000"
  },
  "analysis": {
    "trend": "up",
    "support": ["64000附近", "62000附近"],
    "resistance": ["72000附近", "75000附近"],
    "pattern": "ascending_triangle",
    "marketState": "breakout",
    "volatility": "medium",
    "confidence": 0.75
  }
}`

  try {
    const apiUrl = import.meta.env.VITE_OPENROUTER_API_KEY
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        ...(import.meta.env.VITE_OPENROUTER_API_KEY && {
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Signal Trading Assistant',
        }),
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_OPENROUTER_API_KEY
          ? 'anthropic/claude-3.5-sonnet'
          : 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('AI analysis error:', error)
    throw new Error('Failed to analyze image with AI. Please try again.')
  }
}

// 获取币安实时数据
async function fetchBinanceData(symbol: string): Promise<RealtimeData> {
  try {
    // 标准化symbol并修正常见错误
    let binanceSymbol = symbol.replace(/[\/\s]/g, '').toUpperCase()

    // 修正 ETHUSD -> ETHUSDT, BTCUSD -> BTCUSDT
    if (binanceSymbol.endsWith('USD') && !binanceSymbol.endsWith('USDT') && !binanceSymbol.endsWith('USDC')) {
      binanceSymbol = binanceSymbol + 'T'
    }

    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`
    )

    if (!response.ok) {
      console.warn(`Binance API failed for ${binanceSymbol}: ${response.status}`)
      throw new Error('Failed to fetch Binance data')
    }

    const ticker = await response.json()

    return {
      currentPrice: parseFloat(ticker.lastPrice),
      priceChange24h: ticker.priceChangePercent,
      volume24h: ticker.volume,
    }
  } catch (error) {
    console.error('Binance API error:', error)
    throw new Error('Failed to fetch market data. Please try again.')
  }
}

// Generate trading decision
async function generateDecision(params: {
  imageAnalysis: ImageAnalysisResponse
  realtimeData: RealtimeData
  macroScenarios: string[]
  period: string
}): Promise<TradingDecision> {
  const { imageAnalysis, realtimeData, macroScenarios, period } = params

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('AI API key not configured. Please set VITE_OPENROUTER_API_KEY or VITE_OPENAI_API_KEY.')
  }

  const macroText = macroScenarios.length > 0 ? macroScenarios.join(', ') : 'No specific macro scenario'

  const prompt = `你是专业的加密货币交易顾问。

【图像分析结果】
${JSON.stringify(imageAnalysis, null, 2)}

【实时市场数据】
交易对: ${imageAnalysis.detected.symbol}
当前价格: ${realtimeData.currentPrice}
24h涨跌: ${realtimeData.priceChange24h}

【宏观情景】
${macroText}

请为未来 ${period} 生成交易建议：

要求：
- 现货: 建仓/持有/减仓，**精确价格区间**（使用实时数据）
- 合约: 多空偏好，入场点，止损位
- 期权: 可选策略建议（如买入看涨/看跌、价差策略）
- 综合图像直觉和数据精度
- 风险提示: 至少3条
- 避免绝对判断，使用条件和概率描述

严格按照JSON格式输出：
{
  "spot": {
    "action": "回调分批建仓",
    "priceZone": "64000-66000",
    "logic": "趋势保持，回调至支撑位是较好入场点"
  },
  "futures": {
    "bias": "long",
    "entry": "突破72000后回踩确认",
    "stopLoss": "跌破64000",
    "riskReward": "1:2以上"
  },
  "options": {
    "strategy": "买入看涨期权或牛市价差",
    "logic": "波动率上升，适合方向性策略"
  },
  "priceRange": "未来一周预期65000-75000",
  "risks": [
    "宏观预期落空可能导致快速下跌",
    "假突破后回落风险",
    "高波动率环境下止损可能被触发"
  ]
}`

  try {
    const apiUrl = import.meta.env.VITE_OPENROUTER_API_KEY
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        ...(import.meta.env.VITE_OPENROUTER_API_KEY && {
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Signal Trading Assistant',
        }),
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_OPENROUTER_API_KEY
          ? 'tngtech/deepseek-r1t2-chimera:free'
          : 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Decision generation error:', error)
    throw new Error('Failed to generate trading decision. Please try again.')
  }
}
