import type { VercelRequest, VercelResponse } from '@vercel/node'
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  ImageAnalysisResponse,
  Binance24hrTicker,
  RealtimeData,
  TradingDecision,
} from '../src/types'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 仅支持 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { image, macroScenarios, period } = req.body as AnalyzeRequest

    if (!image) {
      return res.status(400).json({ error: 'Image is required' })
    }

    // 第一步：多模态AI分析图片
    const imageAnalysis = await analyzeImageWithAI(image)

    // 第二步：获取实时市场数据
    const realtimeData = await fetchBinanceData(
      imageAnalysis.detected.symbol
    )

    // 第三步：生成交易决策
    const decision = await generateDecision({
      imageAnalysis,
      realtimeData,
      macroScenarios: macroScenarios || [],
      period: period || '1w',
    })

    const response: AnalyzeResponse = {
      detected: imageAnalysis.detected,
      analysis: imageAnalysis.analysis,
      realtime: realtimeData,
      decision,
    }

    return res.status(200).json(response)
  } catch (error) {
    console.error('Analysis error:', error)
    return res.status(500).json({
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

// 多模态AI图像分析
async function analyzeImageWithAI(image: string): Promise<ImageAnalysisResponse> {
  // 注意：这里需要配置你的AI API（OpenRouter/OpenAI/Gemini/DeepSeek）
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('AI API key not configured')
  }

  const prompt = `你是专业的加密货币技术分析师。

请分析这张K线图截图，完成以下任务：

【识别信息】
1. 识别交易对（如 BTC/USDT, ETH/USDT）
2. 识别时间周期（如 1H, 4H, 1D）
3. 识别当前大致价格区间

【技术分析】
4. 判断整体趋势（上涨/下跌/震荡）
5. 识别关键支撑位和压力位（相对位置即可）
6. 识别明显的技术形态（如三角形、双顶、头肩等）
7. 判断市场状态（突破/回调/盘整）
8. 评估波动率水平（从K线振幅判断）

【重要】
- 仅分析图片中可见的内容
- 价格位可以是大致区间
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
    // 使用OpenRouter或其他多模态API
    const apiUrl = process.env.OPENROUTER_API_KEY
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...(process.env.OPENROUTER_API_KEY && {
          'HTTP-Referer': 'https://signal-crypto.vercel.app',
          'X-Title': 'Signal Trading Assistant',
        }),
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_API_KEY
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

    // 提取JSON
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
async function fetchBinanceData(
  symbol: string
): Promise<RealtimeData> {
  try {
    // 标准化symbol（移除斜杠和空格）
    const binanceSymbol = symbol.replace(/[\/\s]/g, '').toUpperCase()

    // 获取24h行情数据
    const tickerResponse = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`
    )

    if (!tickerResponse.ok) {
      throw new Error('Failed to fetch Binance data')
    }

    const ticker: Binance24hrTicker = await tickerResponse.json()

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

// 生成交易决策
async function generateDecision(params: {
  imageAnalysis: ImageAnalysisResponse
  realtimeData: RealtimeData
  macroScenarios: string[]
  period: string
}): Promise<TradingDecision> {
  const { imageAnalysis, realtimeData, macroScenarios, period } = params

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('AI API key not configured')
  }

  const macroText = macroScenarios.length > 0
    ? macroScenarios.join(', ')
    : '无特定宏观场景'

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
    "logic": "波动率上升，适合方向性策略，但用价差控制成本"
  },
  "priceRange": "未来一周预期65000-75000",
  "risks": [
    "宏观预期落空可能导致快速下跌",
    "假突破后回落风险",
    "高波动率环境下止损可能被触发"
  ]
}`

  try {
    const apiUrl = process.env.OPENROUTER_API_KEY
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...(process.env.OPENROUTER_API_KEY && {
          'HTTP-Referer': 'https://signal-crypto.vercel.app',
          'X-Title': 'Signal Trading Assistant',
        }),
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_API_KEY
          ? 'anthropic/claude-3.5-sonnet'
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

    // 提取JSON
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
