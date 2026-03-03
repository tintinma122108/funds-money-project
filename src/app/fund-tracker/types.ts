// 基金持仓数据类型
export interface FundHolding {
  id: string;
  fundName: string; // 基金名称
  fundCode: string; // 基金代码
  purchasePrice: number; // 当前持仓成本价（净值）
  shares: number; // 持有份额

  holdingAmount: number; // 持有金额：当前持仓市值（包含收益）= shares × currentPrice（实时计算，用于列表显示）
  holdingCost: number; // 持有成本：持仓成本价 x 持有份额

  currentPrice: number; // 估算/实时净值（用于估算）
  yesterdayPrice: number; // 昨日净值（用于当日涨跌计算）
  currentValue: number; // 当前持仓市值：当前价格 x 持有份额

  holdingProfit: number; // 持有收益：当前持仓市值 - 持有成本
  holdingProfitPercent: number; // 持有收益率：当前持有收益 / 持有成本 * 100%

  estimatedTodayProfit: number; // 估算今日收益：当日估算基金净值的变更 x 份额 = (当前价格 - 昨日净值) x 份额
  estimatedTodayChangePercent: number; // 估算今日涨跌：当日估算净值变更对应的当日涨跌幅
}

// 总持仓统计
export interface PortfolioSummary {
  totalValue: number; // 总持仓金额：当前持仓总金额（包含收益）= Σ当前市值
  totalHoldingProfit: number; // 持仓总收益：Σ持有收益
  totalEstimatedTodayProfit: number; // 估算今日总收益：Σ估算今日收益
  totalEstimatedTodayChangePercent: number; // 估算今日涨跌：组合当日综合涨跌幅
}

// 从截图识别的基金信息（OCR结果）
export interface RecognizedFund {
  fundName: string;
  fundCode: string;
  shares: number; // 持仓份额（单位：份）
  holdingAmount: number; // 持仓金额（单位：元）- 当前市值（包含收益）
  purchasePrice: number; // 持仓成本（单位：元/份）
}

