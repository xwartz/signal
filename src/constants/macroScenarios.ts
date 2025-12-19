import type { MacroScenario } from '../types'

export const MACRO_SCENARIOS: { scenarios: MacroScenario[] } = {
  scenarios: [
    {
      id: 'fed_cut',
      label: '美联储降息预期',
      bias: 'risk-on',
      impact: 'positive',
    },
    {
      id: 'etf_inflow',
      label: 'BTC ETF资金净流入',
      bias: 'risk-on',
      impact: 'positive',
    },
    {
      id: 'high_cpi',
      label: 'CPI高于预期',
      bias: 'risk-off',
      impact: 'negative',
    },
    {
      id: 'geopolitical',
      label: '地缘政治风险',
      bias: 'risk-off',
      impact: 'negative',
    },
    {
      id: 'btc_halving',
      label: 'BTC减半周期',
      bias: 'risk-on',
      impact: 'positive',
    },
    {
      id: 'regulation',
      label: '监管政策收紧',
      bias: 'risk-off',
      impact: 'negative',
    },
  ],
}
