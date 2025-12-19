# AI Crypto Trading Assistant

> 基于多模态AI的加密货币交易决策系统 | Hackathon Project

## 🚀 特性

- **📸 截图识别**：支持拖放、点击选择、**复制粘贴**（Ctrl+V / Cmd+V）
- **🤖 多模态AI**：自动识别交易对、时间周期、技术形态
- **📊 数据校准**：结合币安API实时数据，确保价格准确性
- **💡 多维建议**：涵盖现货、合约、期权策略
- **🌓 主题切换**：支持明暗主题，跟随系统偏好
- **⚡ 快速部署**：基于 Vercel Serverless，无需后端服务器

## 📦 技术栈

- **前端**: React 18 + TypeScript + Vite + TailwindCSS
- **API**: Vercel Serverless Functions
- **AI**: OpenRouter / OpenAI / Gemini (支持多种多模态模型)
- **数据源**: Binance API

## 🛠️ 安装与运行

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置 API Key（可选，用于本地开发）

> **注意**：从现在开始，你不需要配置环境变量！API Key 可以直接在网页界面中设置。

如果你想在本地开发时预先配置 API Key，可以创建 `.env.local` 文件：

```bash
# 这些环境变量仅用于本地开发的便利性
# 部署后，用户可以在网页界面中直接输入 API Key

# OpenRouter API Key (推荐)
VITE_OPENROUTER_API_KEY=your_api_key_here

# 或使用 OpenAI API Key
VITE_OPENAI_API_KEY=your_api_key_here
```

**但更推荐的方式是**：直接在网页右上角的"Set API Key"按钮中输入。

### 3. 本地开发

```bash
pnpm dev
```

访问 http://localhost:5173

### 4. 构建

```bash
pnpm build
```

### 5. 部署到 Vercel

#### 一键部署（推荐）

1. **导入项目**
   - 访问 [Vercel Dashboard](https://vercel.com/new)
   - 选择你的 GitHub 仓库
   - 点击 Import
   - **无需配置任何环境变量！**
   - 点击 Deploy

2. **使用应用**
   - 部署完成后，访问你的 Vercel 域名
   - 点击右上角的 "Set API Key" 按钮
   - 输入你的 OpenRouter 或 OpenAI API Key
   - 开始使用！

#### 通过 CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署（无需配置环境变量）
vercel --prod
```

#### 获取 API Key

- **OpenRouter** (推荐): https://openrouter.ai/keys
- **OpenAI**: https://platform.openai.com/api-keys

#### 常见问题

**Q: API Key 存储在哪里？**
A: API Key 存储在你的浏览器 localStorage 中，不会发送到任何服务器。

**Q: 我的 API Key 安全吗？**
A: API Key 仅存储在你的浏览器本地，所有 AI API 调用都是从你的浏览器直接发送到 OpenRouter/OpenAI，不经过任何中间服务器。

**Q: 为什么推荐 OpenRouter？**
A: OpenRouter 支持多种 AI 模型（包括 Claude 3.5 Sonnet），价格更优惠，且 API 更稳定。

## 📖 使用指南

### 基本流程

1. **上传K线截图**
   - 拖放图片文件
   - 点击选择文件
   - **直接复制粘贴截图** (最快捷!)

2. **配置分析参数**
   - 选择分析周期（1周/2周/1月）
   - 选择宏观场景（可多选）

3. **查看分析结果**
   - AI识别信息
   - 技术分析详情
   - 交易建议（现货/合约/期权）
   - 风险提示

### 最佳实践

- ✅ 截图应包含交易对名称和时间周期
- ✅ K线数量越多，分析越准确 (建议50根以上)
- ✅ 截图清晰，避免模糊
- ✅ 选择相关的宏观场景以获得更精准的建议

## 🏗️ 项目结构

```
signal/
├── api/                    # Vercel Serverless Functions
│   └── analyze.ts          # 主分析API
├── public/
│   └── macro-scenarios.json # 宏观场景配置
├── src/
│   ├── components/         # React组件
│   │   ├── UploadCard.tsx
│   │   ├── MacroSelector.tsx
│   │   ├── ResultCards.tsx
│   │   └── ThemeToggle.tsx
│   ├── types.ts           # TypeScript类型定义
│   ├── App.tsx            # 主应用
│   ├── main.tsx
│   └── index.css          # 全局样式
├── docs/                  # 文档
│   ├── technical-proposal.md
│   └── optimization-proposal.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── vercel.json            # Vercel配置
```

## 🔑 API说明

### POST /api/analyze

**Request:**
```json
{
  "image": "data:image/png;base64,...",
  "macroScenarios": ["fed_cut", "etf_inflow"],
  "period": "1w"
}
```

**Response:**
```json
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
  },
  "realtime": {
    "currentPrice": 68500,
    "priceChange24h": "+2.5%"
  },
  "decision": {
    "spot": { ... },
    "futures": { ... },
    "options": { ... },
    "priceRange": "...",
    "risks": [...]
  }
}
```

## ⚠️ 免责声明

本系统仅供学习和参考，**不构成任何投资建议**。

- ✋ 加密货币投资存在高风险
- ✋ AI分析可能存在误差
- ✋ 请根据自身风险承受能力谨慎决策
- ✋ 过往表现不代表未来收益

## 📝 License

MIT

## 🙏 致谢

- [Binance API](https://binance-docs.github.io/apidocs/)
- [OpenRouter](https://openrouter.ai/)
- [Vercel](https://vercel.com/)
- [TailwindCSS](https://tailwindcss.com/)
