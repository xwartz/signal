# 📌 Tech Spec – 多模态加密货币交易决策系统（Hackathon 版）

## 1. 项目概述

**项目目标**
用户上传交易所 K 线截图（如 BTC/USDT），系统基于 **图像理解 + 技术分析 + 宏观情景**，自动生成未来一段时间（如 1 周）的**交易决策建议**，涵盖：

- 现货交易建议
- 合约交易建议
- 期权策略思路
- 价格区间预期
- 风险与不确定性提示

**项目定位**

> 是一个 **AI 驱动的交易决策辅助系统**，
> 不是自动交易机器人，也不进行价格预测。

---

## 2. 技术约束与设计原则

### 2.1 技术约束

| 项目       | 说明                        |
| ---------- | --------------------------- |
| 开发周期   | Hackathon（1 天）           |
| 后端服务   | ❌ 无传统后端                |
| API 实现   | Vercel Serverless Functions |
| 部署平台   | Vercel                      |
| 构建工具   | Vite                        |
| 开发语言   | TypeScript                  |
| 样式方案   | TailwindCSS                 |
| 包管理工具 | pnpm                        |
| 实时行情   | 使用币安 API                |
| 自动下单   | ❌ 不支持                    |

> 所有 AI 调用通过 Vercel Serverless Function 完成，整体仍为前端项目。

---

### 2.2 设计原则

- **极简架构，保证 1 天内完成**
- **多模态优先（截图 → 理解）**
- **决策解释优先，而非价格预测**
- **结果可视化、可读性强**
- **为扩展而设计，但不实现**

---

## 3. 技术栈

### 3.1 前端技术栈

| 技术                    | 用途             |
| ----------------------- | ---------------- |
| React                   | UI 框架          |
| Vite                    | 构建与开发服务器 |
| TypeScript              | 类型系统         |
| TailwindCSS             | 样式与布局       |
| pnpm                    | 依赖管理         |
| Zustand（可选）         | 轻量状态管理     |
| React Hook Form（可选） | 表单管理         |

---

### 3.2 AI / 多模态能力

| 项目       | 说明                                     |
| ---------- | ---------------------------------------- |
| 多模态模型 | openrouter / ChatGPT / Gemini / DeepSeek |
| 输入       | K 线截图 + Prompt                        |
| 输出       | 严格 JSON Schema                         |
| 交互方式   | 单次请求，链式推理                       |

---

### 3.3 部署与运行

| 项目         | 说明                         |
| ------------ | ---------------------------- |
| 平台         | Vercel                       |
| API 运行环境 | Serverless Functions         |
| 密钥管理     | Vercel Environment Variables |
| 前端访问     | 静态页面                     |

---

## 4. 系统整体架构

```text
Browser (React + Vite)
   │
   │ 1. 上传 K 线截图
   │ 2. 选择分析周期与宏观情景
   │
   ▼
Vercel Serverless Function (/api/analyze)
   │
   │ 3. 多模态图像理解（技术面）
   │ 4. 技术结构化分析
   │ 5. 注入宏观情景
   │ 6. 生成交易决策
   ▼
Browser
   │
   │ 7. 卡片式展示分析与决策结果

## 5. 核心功能模块
### 5.1 K 线截图上传模块

**功能描述**
- 支持 PNG / JPG 格式
- 客户端图片预览
- 限制文件大小（≤ 5MB）

**实现方式**
- 使用 <input type="file" />
- 使用 FileReader 转换为 Base64
- 通过 fetch 发送至 Serverless API

### 5.2 技术面图像理解模块（AI）

**功能描述**
- 从截图中识别 K 线结构
- 判断趋势、形态、支撑与压力
- 评估当前波动率水平

**技术分析输出 Schema**

```ts
export interface TechnicalAnalysis {
  timeframe: string
  trend: 'up' | 'down' | 'range'
  marketState: 'breakout' | 'pullback' | 'range'
  support: number[]
  resistance: number[]
  pattern?: string
  volatility: 'low' | 'medium' | 'high'
  confidence: number
}
```

### 5.3 宏观情景模块（手动注入）

**设计说明**
- 当前方案不实时抓取宏观数据
- 可使用一个 JSON 文件，预设未来一段时间宏观信息

**预设宏观情景**
- 美联储降息预期
- CPI 高于市场预期
- 加密 ETF 资金流入
- 地缘政治风险上升

**宏观情景 Schema**

```ts
export interface MacroScenario {
  event: string
  bias: 'risk-on' | 'risk-off' | 'neutral'
  impact: 'positive' | 'negative' | 'uncertain'
}
```

### 5.4 交易决策生成模块（AI）

**功能描述**
- 综合技术面与宏观情景
- 输出多维度交易决策建议
- 强调条件、概率与风险

**交易决策输出 Schema**

```ts
export interface TradingDecision {
  spot: {
    action: string
    idealZone?: string
    logic: string
  }
  futures: {
    bias: 'long' | 'short' | 'neutral'
    entry: string
    stopLoss: string
    riskReward: string
  }
  options?: {
    strategy: string
    logic: string
  }
  priceRange: string
  risks: string[]
}
```

## 6. Prompt 设计
### 6.1 技术分析 Prompt（多模态）

```
你是一名专业的加密货币技术分析师。

请基于上传的 K 线截图完成以下任务：
1. 判断时间级别（如 1H / 4H / 1D）
2. 判断当前趋势（上涨 / 下跌 / 震荡）
3. 标注关键支撑与压力（区间即可）
4. 判断是否存在明显技术形态
5. 判断当前波动率水平

要求：
- 仅基于图片内容分析
- 禁止编造图片中不存在的信息
- 使用 JSON 格式输出
```

### 6.2 交易决策生成 Prompt

```
你是一名加密货币交易顾问。

基于以下技术分析结果与宏观情景，
请为未来 {{period}} 给出交易决策建议。

要求：
- 覆盖现货、合约与期权
- 使用条件与概率描述
- 避免绝对判断
- 明确提示风险与不确定性

输出必须严格符合 JSON Schema。
```

## 7. API 设计（Vercel Serverless）

### 7.1 POST /api/analyze

**Request Body**

```json
{
  "image": "base64-image-string",
  "macro": ["fed_cut", "etf_inflow"],
  "period": "1w"
}
```

**Response Body**

```json
{
  "technical": {
    "timeframe": "4H",
    "trend": "up",
    "marketState": "breakout",
    "support": [64000],
    "resistance": [72000],
    "pattern": "ascending_triangle",
    "volatility": "high",
    "confidence": 0.72
  },
  "decision": {
    "spot": {
      "action": "回调分批建仓",
      "idealZone": "64000-66000",
      "logic": "趋势保持且宏观偏多"
    },
    "futures": {
      "bias": "long",
      "entry": "突破回踩确认",
      "stopLoss": "跌破 64000",
      "riskReward": "1:2 以上"
    },
    "options": {
      "strategy": "看涨价差",
      "logic": "波动率上升但控制时间衰减风险"
    },
    "priceRange": "65000-75000",
    "risks": [
      "宏观预期落空",
      "假突破后快速回落"
    ]
  }
}
```

## 8. 前端页面结构

```
/
 ├─ components/
 │   ├─ UploadCard.tsx
 │   ├─ MacroSelector.tsx
 │   ├─ AnalyzeButton.tsx
 │   ├─ TechnicalResultCard.tsx
 │   └─ TradingDecisionCard.tsx
 ├─ pages/
 │   └─ index.tsx
 └─ api/
     └─ analyze.ts
```

## 9. UI / UX 设计原则

- 支持主题切换，默认使用系统主题
- 卡片式信息分区
- Badge 显示趋势与偏好
- 风险信息高亮显示
- 信息密度可控，避免过载
- 风格参考：https://github.com/xwartz/lppl

## 10. 安全与限制

- API Key 仅存储于 Vercel 环境变量
- 前端不暴露任何敏感信息
- 简单防抖，防止重复请求
- 明确免责声明：非投资建议

## 11. Hackathon Demo 讲解话术（示例）

- 用户只需要上传一张交易所的 K 线截图
- AI 就能理解当前市场结构
- 并结合宏观预期
- 给出一整套清晰、可解释的交易决策思路
- 这是一个为交易者设计的 AI 决策助手
