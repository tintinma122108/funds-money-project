import { FundHolding, PortfolioSummary, RecognizedFund } from './types';

export interface FundSnapshot {
  fundCode: string;
  fundName?: string;
  currentPrice: number;
  yesterdayPrice: number;
  changePercent: number; // 当日涨跌幅（基于昨日净值）
  updateTime?: string;
}

// Snapshot 缓存（每秒刷新，缓存时间缩短）
const snapshotCache = new Map<string, { snapshot: FundSnapshot; timestamp: number }>();
const CACHE_DURATION = 1500; // 1.5s 缓存，配合 2s 刷新，减少不必要的请求

// 模拟基金名称映射（作为备用）
const mockFundNames: Record<string, string> = {
  '000001': '华夏成长混合',
  '000002': '嘉实增长混合',
  '110022': '易方达消费行业股票',
  '161725': '招商中证白酒指数',
  '005827': '易方达蓝筹精选混合',
  '163402': '兴全趋势投资混合',
};

/**
 * 根据基金代码获取快照（从API获取）
 */
export async function getFundSnapshot(fundCode: string): Promise<FundSnapshot> {
  // 检查缓存
  const cached = snapshotCache.get(fundCode);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.snapshot;
  }

  try {
    // 调用API获取快照
    const response = await fetch(`/api/fund/price?code=${fundCode}`);
    const result = await response.json();

    if (result.success && result.data) {
      const snapshot: FundSnapshot = {
        fundCode: result.data.fundCode || fundCode,
        fundName: result.data.fundName,
        currentPrice: Number(result.data.currentPrice) || 1.0,
        yesterdayPrice: Number(result.data.yesterdayPrice) || Number(result.data.currentPrice) || 1.0,
        changePercent: Number(result.data.changePercent) || 0,
        updateTime: result.data.updateTime,
      };
      // 更新缓存
      snapshotCache.set(fundCode, {
        snapshot,
        timestamp: Date.now(),
      });
      return snapshot;
    }
  } catch (error) {
    console.error(`Failed to fetch snapshot for ${fundCode}:`, error);
  }

  // API失败时返回缓存值或默认值
  return (
    cached?.snapshot ?? {
      fundCode,
      fundName: mockFundNames[fundCode] || `基金${fundCode}`,
      currentPrice: 1.0,
      yesterdayPrice: 1.0,
      changePercent: 0,
    }
  );
}

/**
 * 批量获取基金快照
 */
export async function getMultipleFundSnapshots(
  fundCodes: string[]
): Promise<Map<string, FundSnapshot>> {
  const snapshots = new Map<string, FundSnapshot>();
  const codesToFetch: string[] = [];

  // 检查缓存
  fundCodes.forEach((code) => {
    const cached = snapshotCache.get(code);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      snapshots.set(code, cached.snapshot);
    } else {
      codesToFetch.push(code);
    }
  });

  // 批量获取未缓存的基金快照
  if (codesToFetch.length > 0) {
    try {
      const response = await fetch(
        `/api/fund/price?codes=${codesToFetch.join(',')}`
      );
      const result = await response.json();

      if (result.success && result.data) {
        Object.entries(result.data).forEach(([code, info]: [string, any]) => {
          const snapshot: FundSnapshot = {
            fundCode: info.fundCode || code,
            fundName: info.fundName,
            currentPrice: Number(info.currentPrice) || 1.0,
            yesterdayPrice: Number(info.yesterdayPrice) || Number(info.currentPrice) || 1.0,
            changePercent: Number(info.changePercent) || 0,
            updateTime: info.updateTime,
          };
          snapshots.set(code, snapshot);
          // 更新缓存
          snapshotCache.set(code, {
            snapshot,
            timestamp: Date.now(),
          });
        });
      }
    } catch (error) {
      console.error('Failed to fetch multiple fund snapshots:', error);
    }
  }

  return snapshots;
}

/**
 * 根据基金代码获取基金名称（从API获取，失败时使用备用数据）
 */
export async function getFundName(fundCode: string): Promise<string> {
  try {
    const response = await fetch(`/api/fund/price?code=${fundCode}`);
    const result = await response.json();

    if (result.success && result.data && result.data.fundName) {
      return result.data.fundName;
    }
  } catch (error) {
    console.error(`Failed to fetch fund name for ${fundCode}:`, error);
  }

  // 使用备用数据
  return mockFundNames[fundCode] || `基金${fundCode}`;
}

/**
 * 根据基金代码获取当前价格（兼容旧调用点）
 */
export async function getCurrentPrice(fundCode: string): Promise<number> {
  const snapshot = await getFundSnapshot(fundCode);
  return snapshot.currentPrice;
}

/**
 * 计算基金持仓信息（异步版本，使用真实API）
 */
export async function calculateFundHolding(
  fundCode: string,
  fundName: string,
  shares: number, // 使用用户输入的份额
  holdingAmount: number, // 用户输入的持仓金额 = 当前市值（包含收益）
  purchasePrice: number // 用户输入的持仓成本（元/份）
): Promise<FundHolding> {
  // 确保所有输入值有效
  const safePurchasePrice = purchasePrice || 1;
  const safeHoldingAmount = holdingAmount || 0; // 用户输入的持仓金额 = 当前市值
  const safeShares = shares || (safeHoldingAmount / safePurchasePrice); // 优先使用用户输入的份额
  
  // 持有成本 = 持仓成本价 x 持有份额
  const holdingCost = safePurchasePrice * safeShares;
  
  // 获取快照（用于计算今日收益和涨跌幅）
  const snapshot = await getFundSnapshot(fundCode);
  const safeCurrentPrice = snapshot.currentPrice || (safeHoldingAmount / safeShares); // 如果API失败，使用用户输入的市值反推价格
  const safeYesterdayPrice = snapshot.yesterdayPrice || safeCurrentPrice;
  
  // 当前市值 = shares × currentPrice（实时计算，用于列表显示）
  const currentValue = safeShares * safeCurrentPrice;
  
  // 持有收益 = 当前市值 - 持有成本
  const holdingProfit = currentValue - holdingCost;
  
  // 持有收益率 = 持有收益 / 持有成本 * 100%
  const holdingProfitPercent = holdingCost > 0 
    ? (holdingProfit / holdingCost) * 100 
    : 0;
  
  // 估算今日收益 = (当日估算净值变更) x 份额 = (当前价格 - 昨日净值) x 份额
  const estimatedTodayProfit = (safeCurrentPrice - safeYesterdayPrice) * safeShares;
  // 估算今日涨跌：直接使用接口涨跌幅（否则回退计算）
  const estimatedTodayChangePercent =
    Number.isFinite(snapshot.changePercent) && snapshot.changePercent !== 0
      ? snapshot.changePercent
      : safeYesterdayPrice > 0
        ? ((safeCurrentPrice - safeYesterdayPrice) / safeYesterdayPrice) * 100
        : 0;

  return {
    id: `${fundCode}-${Date.now()}`,
    fundName: fundName || `基金${fundCode}`,
    fundCode,
    purchasePrice: safePurchasePrice,
    shares: safeShares || 0,
    holdingAmount: currentValue || 0, // 当前市值 = shares × currentPrice（实时计算）
    holdingCost: holdingCost || 0,
    currentPrice: safeCurrentPrice,
    yesterdayPrice: safeYesterdayPrice,
    currentValue: currentValue || 0,
    holdingProfit: holdingProfit || 0,
    holdingProfitPercent: holdingProfitPercent || 0,
    estimatedTodayProfit: estimatedTodayProfit || 0,
    estimatedTodayChangePercent: estimatedTodayChangePercent || 0,
  };
}

/**
 * 计算基金持仓信息（同步版本，使用缓存价格）
 * 用于快速更新，避免等待API响应
 */
export function calculateFundHoldingSync(
  fundCode: string,
  fundName: string,
  holdingAmount: number,
  purchasePrice: number,
  currentPrice: number,
  yesterdayPrice: number,
  changePercent: number,
  existingId?: string, // 保留原有ID
  existingShares?: number // 保留原有份额
): FundHolding {
  // 确保所有输入值有效
  const safePurchasePrice = purchasePrice || 1;
  const safeHoldingAmount = holdingAmount || 0; // 当前市值（包含收益）
  const safeCurrentPrice = currentPrice || safePurchasePrice;
  const safeYesterdayPrice = yesterdayPrice || safeCurrentPrice;

  // 如果有原有份额，使用原有份额；否则根据当前市值和当前价格计算
  const shares = existingShares || (safeHoldingAmount > 0 ? safeHoldingAmount / safeCurrentPrice : 0);
  
  // 持有成本 = 持仓成本价 x 持有份额
  const holdingCost = safePurchasePrice * shares;
  
  // 当前市值 = shares × currentPrice（实时计算，用于列表显示）
  // 始终使用实时价格计算，确保数据准确性
  const currentValue = shares * safeCurrentPrice;
  
  // 持有收益 = 当前市值 - 持有成本
  const holdingProfit = currentValue - holdingCost;
  
  // 持有收益率 = 持有收益 / 持有成本 * 100%
  const holdingProfitPercent = holdingCost > 0 
    ? (holdingProfit / holdingCost) * 100 
    : 0;
  
  // 估算今日收益 = (当前价格 - 昨日净值) x 份额
  const estimatedTodayProfit = (safeCurrentPrice - safeYesterdayPrice) * shares;
  // 估算今日涨跌：优先用接口涨跌幅
  const estimatedTodayChangePercent =
    Number.isFinite(changePercent) && changePercent !== 0
      ? changePercent
      : safeYesterdayPrice > 0
        ? ((safeCurrentPrice - safeYesterdayPrice) / safeYesterdayPrice) * 100
        : 0;

  return {
    id: existingId || `${fundCode}-${Date.now()}`,
    fundName: fundName || `基金${fundCode}`,
    fundCode,
    purchasePrice: safePurchasePrice,
    shares: shares || 0,
    holdingAmount: currentValue || 0, // 当前市值 = shares × currentPrice（实时计算）
    holdingCost: holdingCost || 0,
    currentPrice: safeCurrentPrice,
    yesterdayPrice: safeYesterdayPrice,
    currentValue: currentValue || 0,
    holdingProfit: holdingProfit || 0,
    holdingProfitPercent: holdingProfitPercent || 0,
    estimatedTodayProfit: estimatedTodayProfit || 0,
    estimatedTodayChangePercent: estimatedTodayChangePercent || 0,
  };
}

/**
 * 计算总持仓统计
 */
export function calculatePortfolioSummary(holdings: FundHolding[]): PortfolioSummary {
  const totalValue = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
  const totalHoldingProfit = holdings.reduce((sum, h) => sum + (h.holdingProfit || 0), 0);
  const totalEstimatedTodayProfit = holdings.reduce(
    (sum, h) => sum + (h.estimatedTodayProfit || 0),
    0
  );

  // 组合当日综合涨跌幅 = (今日总市值 - 昨日总市值) / 昨日总市值 * 100%
  const totalYesterdayValue = holdings.reduce((sum, h) => {
    const shares = h.shares || 0;
    const yesterdayPrice = h.yesterdayPrice || 0;
    return sum + shares * yesterdayPrice;
  }, 0);
  const totalEstimatedTodayChangePercent =
    totalYesterdayValue > 0 ? ((totalValue - totalYesterdayValue) / totalYesterdayValue) * 100 : 0;

  return {
    totalValue,
    totalHoldingProfit,
    totalEstimatedTodayProfit,
    totalEstimatedTodayChangePercent,
  };
}

/**
 * OCR识别基金信息
 * 使用Tesseract.js在客户端进行OCR识别
 */
export async function recognizeFundFromImage(imageFile: File): Promise<RecognizedFund[]> {
  console.log('开始OCR识别，文件:', imageFile.name, '大小:', imageFile.size);
  
  try {
    // 尝试动态导入Tesseract.js
    let Tesseract;
    try {
      Tesseract = (await import('tesseract.js')).default;
      console.log('Tesseract.js加载成功');
    } catch (importError) {
      console.warn('Tesseract.js未安装，错误:', importError);
      throw new Error('Tesseract.js未安装，请运行: npm install tesseract.js');
    }
    
    // 执行OCR识别
    console.log('开始执行OCR识别...');
    const { data: { text } } = await Tesseract.recognize(imageFile, 'chi_sim+eng', {
      logger: (m) => {
        // 显示详细进度
        if (m.status === 'recognizing text') {
          const progress = Math.round(m.progress * 100);
          console.log(`OCR进度: ${progress}%`);
        } else {
          console.log(`OCR状态: ${m.status}`, m);
        }
      },
    });

    console.log('OCR识别完成，识别文本长度:', text.length);
    console.log('OCR识别文本:', text);

    if (!text || text.trim().length === 0) {
      throw new Error('OCR未能识别到任何文本，请确保图片清晰');
    }

    // 解析OCR文本，提取基金信息
    const funds = parseFundInfoFromText(text);
    
    console.log('解析结果，找到基金数量:', funds.length);
    
    if (funds.length === 0) {
      console.warn('未能从OCR文本中解析出基金信息');
      console.log('原始文本:', text);
      // 返回空数组，让用户手动输入
      throw new Error('未能识别到基金信息。识别到的文本：' + text.substring(0, 200));
    }

    return funds;
  } catch (error: any) {
    console.error('OCR识别失败:', error);
    // 抛出错误，让调用者处理（显示手动输入界面）
    throw error;
  }
}

/**
 * 从OCR文本中解析基金信息
 * 优化版本：支持识别多个基金，更准确的模式匹配
 */
function parseFundInfoFromText(text: string): RecognizedFund[] {
  const funds: RecognizedFund[] = [];
  
  // 清理文本：移除多余空格，统一换行符
  const cleanText = text.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();
  
  // 基金代码正则：6位数字（更严格的匹配）
  const fundCodeRegex = /\b([0156]\d{5})\b/g;
  
  // 基金名称模式：更全面的匹配
  const fundNamePatterns = [
    /([\u4e00-\u9fa5]{2,30}(?:基金|混合|股票|指数|债券|ETF|LOF|QDII|FOF))/g,
    /([\u4e00-\u9fa5]{2,30}(?:成长|价值|消费|科技|医疗|新能源|蓝筹|精选|优选|稳健))/g,
    /([\u4e00-\u9fa5]{2,30}(?:易方达|华夏|嘉实|南方|博时|广发|汇添富|富国|招商|工银))/g,
  ];
  
  // 金额模式：更精确的匹配
  const amountPatterns = [
    /(?:持有|持仓|金额|市值)[:：]?\s*([\d,]+\.?\d*)\s*(?:元|万元?)/gi,
    /([\d,]+\.?\d*)\s*(?:元|万元?)/g,
    /¥\s*([\d,]+\.?\d*)/g,
  ];
  
  // 净值/价格模式
  const pricePatterns = [
    /(?:净值|价格|买入价|成本)[:：]?\s*([\d.]+)/gi,
    /([\d.]+)\s*(?:元\/份|元\/股)/gi,
    /单位净值[:：]?\s*([\d.]+)/gi,
  ];

  // 按行分割文本，便于逐行分析
  const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // 方法1：按行查找，每行可能包含一个基金的信息
  const fundBlocks: Array<{ code: string; lineIndex: number; context: string }> = [];
  
  // 首先找到所有基金代码及其位置
  lines.forEach((line, index) => {
    let match;
    const codeRegex = new RegExp(fundCodeRegex.source, 'g');
    while ((match = codeRegex.exec(line)) !== null) {
      const code = match[1];
      // 获取上下文（当前行及前后各2行）
      const contextStart = Math.max(0, index - 2);
      const contextEnd = Math.min(lines.length, index + 3);
      const context = lines.slice(contextStart, contextEnd).join(' ');
      
      fundBlocks.push({
        code,
        lineIndex: index,
        context,
      });
    }
  });

  // 如果没有找到代码，尝试在整个文本中搜索
  if (fundBlocks.length === 0) {
    let match;
    const codeRegex = new RegExp(fundCodeRegex.source, 'g');
    while ((match = codeRegex.exec(cleanText)) !== null) {
      const code = match[1];
      const codeIndex = cleanText.indexOf(code);
      const contextStart = Math.max(0, codeIndex - 100);
      const contextEnd = Math.min(cleanText.length, codeIndex + 200);
      const context = cleanText.substring(contextStart, contextEnd);
      
      fundBlocks.push({
        code,
        lineIndex: -1,
        context,
      });
    }
  }

  // 为每个找到的代码创建基金对象
  for (const block of fundBlocks) {
    const { code, context } = block;
    
    // 查找基金名称（在代码附近）
    let fundName = '';
    for (const pattern of fundNamePatterns) {
      const matches = context.match(pattern);
      if (matches && matches.length > 0) {
        // 选择最接近代码的名称
        fundName = matches[0].trim();
        break;
      }
    }

    // 查找持仓金额（在代码附近查找）
    let holdingAmount = 0;
    const amountContext = context;
    for (const pattern of amountPatterns) {
      const matches = amountContext.match(pattern);
      if (matches && matches.length > 0) {
        let amountStr = matches[matches.length - 1].replace(/,/g, ''); // 取最后一个匹配
        const isWan = matches[0].includes('万');
        const parsed = parseFloat(amountStr);
        if (!isNaN(parsed) && parsed > 0) {
          holdingAmount = parsed * (isWan ? 10000 : 1);
          break;
        }
      }
    }

    // 查找买入价格/净值
    let purchasePrice: number | undefined;
    for (const pattern of pricePatterns) {
      const matches = context.match(pattern);
      if (matches && matches.length > 0) {
        const parsed = parseFloat(matches[matches.length - 1]);
        if (!isNaN(parsed) && parsed > 0 && parsed < 100) { // 净值通常在0-100之间
          purchasePrice = parsed;
          break;
        }
      }
    }

    // 如果找到了代码，就添加到结果中
    // 计算份额：如果有持仓金额和成本价，则计算份额；否则设为0，让用户手动输入
    const calculatedShares = (holdingAmount > 0 && purchasePrice && purchasePrice > 0) 
      ? holdingAmount / purchasePrice 
      : 0;
    
    funds.push({
      fundCode: code,
      fundName: fundName || `基金${code}`,
      shares: calculatedShares, // 计算出的份额，如果为0则用户需要手动输入
      holdingAmount: holdingAmount || 0, // 不设置默认值，让用户手动输入
      purchasePrice: purchasePrice || 1.0, // 如果没有识别到，使用默认值1.0
    });
  }

  // 去重：相同代码的基金只保留一个
  const uniqueFunds = funds.reduce((acc, fund) => {
    if (!acc.find(f => f.fundCode === fund.fundCode)) {
      acc.push(fund);
    }
    return acc;
  }, [] as RecognizedFund[]);

  return uniqueFunds;
}

/**
 * 使用AI Vision API识别基金（备用方案）
 * 注意：当前API未实现，此函数仅作为占位符
 */
async function recognizeFundsWithAI(imageFile: File): Promise<RecognizedFund[]> {
  console.log('尝试使用AI识别...');
  // 当前未实现AI识别API，直接抛出错误让用户手动输入
  throw new Error('AI识别服务暂未配置，请手动输入基金信息');
}

/**
 * 格式化金额
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number | undefined | null): string {
  // 处理 undefined、null 或 NaN
  if (value === undefined || value === null || isNaN(value)) {
    return '+0.00%';
  }
  
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

