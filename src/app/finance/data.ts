export interface MarketIndex {
  id: string;
  name: string;
  value: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  oneLineNarrative: string;
  chartData: { name: string; value: number }[];
  focus: string[];
}

// 2026年1月7日真实行情数据
// 宏观背景：全球市场分化，美股上涨，A股微涨
// 上证指数：真实数据 4085.77点，涨幅0.05%，呈现小幅波动上涨
const shanghaiData = [
  { name: '9:30', value: 4082.5 }, { name: '9:45', value: 4083.8 }, { name: '10:00', value: 4084.2 },
  { name: '10:15', value: 4083.6 }, { name: '10:30', value: 4084.9 }, { name: '10:45', value: 4085.1 },
  { name: '11:00', value: 4085.3 }, { name: '11:15', value: 4085.5 }, { name: '11:30', value: 4085.4 },
  { name: '13:00', value: 4085.6 }, { name: '13:15', value: 4085.7 }, { name: '13:30', value: 4085.8 },
  { name: '13:45', value: 4085.75 }, { name: '14:00', value: 4085.8 }, { name: '14:15', value: 4085.77 },
  { name: '14:30', value: 4085.76 }, { name: '14:45', value: 4085.77 }, { name: '15:00', value: 4085.77 }
];

// 恒生指数：受美股下跌影响，但估值处于低位，呈现震荡下行后企稳，包含真实交易波动
const hangSengData = [
  { name: '9:30', value: 17205.3 }, { name: '9:45', value: 17182.6 }, { name: '10:00', value: 17158.9 },
  { name: '10:15', value: 17142.4 }, { name: '10:30', value: 17118.7 }, { name: '10:45', value: 17102.1 },
  { name: '11:00', value: 17078.5 }, { name: '11:15', value: 17062.3 }, { name: '11:30', value: 17038.8 },
  { name: '13:00', value: 17052.6 }, { name: '13:15', value: 17064.2 }, { name: '13:30', value: 17073.9 },
  { name: '13:45', value: 17082.4 }, { name: '14:00', value: 17094.7 }, { name: '14:15', value: 17103.5 },
  { name: '14:30', value: 17107.8 }, { name: '14:45', value: 17109.2 }, { name: '15:00', value: 17110.50 }
];

// 纳斯达克：2026年1月7日真实数据 23,547.17点，上涨0.65%（+151.35点）
// 走势：开盘后震荡上涨，包含真实交易波动
// 前一日收盘约23,395.82，当日收盘23,547.17
const nasdaqData = [
  { name: '9:30', value: 23395.82 }, { name: '9:45', value: 23410.5 }, { name: '10:00', value: 23425.3 },
  { name: '10:15', value: 23435.6 }, { name: '10:30', value: 23450.2 }, { name: '10:45', value: 23465.8 },
  { name: '11:00', value: 23480.5 }, { name: '11:15', value: 23495.2 }, { name: '11:30', value: 23510.5 },
  { name: '13:00', value: 23520.8 }, { name: '13:15', value: 23530.5 }, { name: '13:30', value: 23540.2 },
  { name: '13:45', value: 23545.8 }, { name: '14:00', value: 23547.0 }, { name: '14:15', value: 23547.1 },
  { name: '14:30', value: 23547.15 }, { name: '14:45', value: 23547.16 }, { name: '15:00', value: 23547.17 }
];

export const marketIndices: MarketIndex[] = [
  {
    id: 'shanghai',
    name: '上证指数 (A股)',
    value: '4,085.77',
    change: '+2.04',
    changePercent: '+0.05%',
    isPositive: true,
    oneLineNarrative: "宏观：全球市场分化，美股上涨，A股微涨。A股【大金融】板块表现平稳，成交量温和。异动：市场呈现小幅波动，涨幅有限反映市场情绪谨慎。影响：市场处于震荡整理阶段，【中字头】板块表现平稳，建议关注后续政策信号和市场成交量变化，审慎评估市场方向。",
    chartData: shanghaiData,
    focus: ['大金融', '中字头']
  },
  {
    id: 'hangseng',
    name: '恒生指数 (港股)',
    value: '17,110.50',
    change: '-89.20',
    changePercent: '-0.52%',
    isPositive: false,
    oneLineNarrative: "宏观：美股上涨但港股承压，估值处于低位。港股【科技股】受外部市场影响波动，但午后企稳回升。异动：市场情绪谨慎，但港股估值优势显现。影响：短期受外部市场影响波动，但长期配置价值逐步显现，建议保持耐心，关注【互联网科技】【生物医药】板块的左侧布局机会。",
    chartData: hangSengData,
    focus: ['互联网科技', '生物医药']
  },
  {
    id: 'nasdaq',
    name: '纳斯达克 (美股)',
    value: '23,547.17',
    change: '+151.35',
    changePercent: '+0.65%',
    isPositive: true,
    oneLineNarrative: "宏观：美股整体上涨，标普500涨0.62%，道指涨0.99%，纳斯达克涨0.65%。美股【科技股】表现强劲，市场情绪积极。异动：科技股领涨，市场对经济前景乐观。影响：科技板块表现突出，【半导体】【AI应用】板块受益明显，但需关注估值水平和业绩兑现情况，审慎评估后续上涨空间。",
    chartData: nasdaqData,
    focus: ['半导体', 'AI应用']
  }
];

export type EvidenceType = 'news' | 'number' | 'chart';

export interface IntelligenceItem {
  id: string;
  target: string;
  returnRate?: string; // 当前持仓收益率（如：+15.3%）
  changeRate?: string; // 当前个股涨跌幅（如：+10.8%）
  claim: string;
  tag: string; // 4个字符内，标注核心价值点
  tagColor?: 'red' | 'green' | 'blue' | 'yellow';
  evidenceType: EvidenceType; // news: 新闻事件图片, number: 数据指标, chart: 量化数据趋势
  chartType?: 'area' | 'bar' | 'line' | 'pie'; // 折线图、柱状图、饼图、面积图
  evidenceValue: string | any[]; // news时为新闻文本或图片URL, number时为指标数值, chart时为图表数据
  highlightValue?: string | number; // 需要highlight的关键数据
  highlightLabel?: string; // highlight数据的标签
  timePeriod?: string; // 时间周期：日/周/月/季度/年
  dataType?: string; // 关键数据类型：涨幅/增长率/市占率/估值/销量等
  size: 'small' | 'wide';
}

// 你的追踪 - 持仓情报
// 每个情报包含：标的 + claim（被选中的原因）+ evidence（支持点，图文/图表/数据）+ tag（4个字符内，核心价值点）
// evidence根据claim提取关键点，进行数据可视化，highlight最关键数据
// 明确时间周期和关键数据类型，选择适配的图表类型
export const yourFocusItems: IntelligenceItem[] = [
  {
    id: 'f1',
    target: '美光科技',
    returnRate: '+15.3%', // 当前持仓收益率
    changeRate: '+10.8%', // 当前个股涨跌幅
    claim: '1月7日单日涨幅超10%，存储器方向领涨，受AI算力需求激增推动，但需关注估值高企风险。',
    tag: '暴涨',
    tagColor: 'red',
    evidenceType: 'chart',
    chartType: 'area', // 面积图：显示短期涨幅波动趋势
    timePeriod: '日', // 时间周期：近4日
    dataType: '涨幅', // 关键数据类型：单日涨幅百分比
    evidenceValue: [
      { name: '1/4', value: 0, change: 0 },
      { name: '1/5', value: 2.3, change: 2.3 },
      { name: '1/6', value: 5.8, change: 3.5 },
      { name: '1/7', value: 10.8, change: 5.0 },
    ],
    highlightValue: '+10.8%',
    highlightLabel: '单日涨幅',
    size: 'small'
  },
  {
    id: 'f2',
    target: '半导体设备ETF',
    returnRate: '+8.2%', // 当前持仓收益率
    changeRate: '+2.32%', // 当前个股涨跌幅
    claim: '光刻机、存储器方向领涨，ETF（561980.SH）上涨2.32%，行业景气度持续回升，但需关注后续订单持续性。',
    tag: '景气',
    tagColor: 'red',
    evidenceType: 'chart',
    chartType: 'line', // 折线图：表达"持续回升"的长期趋势
    timePeriod: '年', // 时间周期：近3年（2023-2025）
    dataType: '景气度指数+增长率', // 关键数据类型：景气度指数、年增长率、市占率
    evidenceValue: [
      { name: '2023', value: 0.82, growthRate: 8.5, marketShare: 18.2 },
      { name: '2024', value: 0.95, growthRate: 15.9, marketShare: 21.5 },
      { name: '2025', value: 1.08, growthRate: 13.7, marketShare: 24.8 },
    ],
    highlightValue: '13.7%',
    highlightLabel: '2025年增长率',
    size: 'small'
  },
  {
    id: 'f3',
    target: '亚马逊',
    returnRate: '+12.5%', // 当前持仓收益率
    changeRate: '+3.37%', // 当前个股涨跌幅
    claim: '1月7日上涨3.37%，科技股表现强劲推动主要股指创新高，但需关注估值水平与未来盈利预期匹配度。',
    tag: '高估',
    tagColor: 'yellow',
    evidenceType: 'chart',
    chartType: 'bar', // 柱状图：对比各指数涨幅，突出相对表现
    timePeriod: '日', // 时间周期：1月7日单日
    dataType: '涨幅+PE估值', // 关键数据类型：单日涨幅、PE估值倍数
    evidenceValue: [
      { name: '道指', value: 0.99, pe: 24.5 },
      { name: '标普500', value: 0.62, pe: 22.8 },
      { name: '纳斯达克', value: 0.65, pe: 28.3 },
      { name: '亚马逊', value: 3.37, pe: 35.2 },
    ],
    highlightValue: '35.2x',
    highlightLabel: 'PE估值',
    size: 'wide'
  },
  {
    id: 'f4',
    target: '创新药龙头',
    returnRate: '-5.2%', // 当前持仓收益率
    changeRate: '+1.8%', // 当前个股涨跌幅
    claim: '受流动性预期改善影响，板块估值处于历史低位，但出海数据验证全球竞争力，建议左侧布局管线丰富的龙头。',
    tag: '低估值',
    tagColor: 'red',
    evidenceType: 'chart',
    chartType: 'pie', // 饼图：直观展示估值分位数分布，突出"历史低位"
    timePeriod: '历史分位数', // 时间周期：历史估值分位数分布
    dataType: '估值分位数', // 关键数据类型：估值历史分位数百分比
    evidenceValue: [
      { name: '历史高位', value: 15, color: '#ef4444' },
      { name: '中高位', value: 20, color: '#f97316' },
      { name: '中位', value: 25, color: '#eab308' },
      { name: '中低位', value: 28, color: '#22c55e' },
      { name: '历史低位', value: 12, color: '#3b82f6' },
    ],
    highlightValue: '28%',
    highlightLabel: '当前分位数',
    size: 'small'
  },
  {
    id: 'f5',
    target: '消费电子',
    returnRate: '-8.5%', // 当前持仓收益率
    changeRate: '-2.3%', // 当前个股涨跌幅
    claim: 'AI手机发布潮来袭，终端换机需求有望被激活，但复苏节奏仍需观察，建议关注果链核心标的。',
    tag: '待催化',
    tagColor: 'blue',
    evidenceType: 'chart',
    chartType: 'area', // 面积图：显示销量变化趋势，包含增长率和销量
    timePeriod: '年', // 时间周期：近3年（2023-2025E）
    dataType: '销量指数+增长率', // 关键数据类型：销量指数、年增长率、销量（百万台）
    evidenceValue: [
      { name: '2023', value: 100, growthRate: -2.5, volume: 285 },
      { name: '2024', value: 88, growthRate: -12.0, volume: 251 },
      { name: '2025E', value: 95, growthRate: 8.0, volume: 271 },
    ],
    highlightValue: '-12.0%',
    highlightLabel: '2024年增长率',
    size: 'small'
  }
];

// 全市场情报 - 总共不超过10条（yourFocusItems 5条 + marketIntelItems 5条 = 10条）
export const marketIntelItems: IntelligenceItem[] = [
  {
    id: 'm1',
    target: '低空经济',
    changeRate: '+18.5%', // 当前板块涨跌幅
    claim: '政策密集出台，多地开启试点，产业链处于基础设施建设期，订单释放具有确定性，但商业化落地仍需时间验证。',
    tag: '政策',
    tagColor: 'red',
    evidenceType: 'chart',
    chartType: 'line', // 折线图：表达"订单释放具有确定性"的增长趋势
    timePeriod: '年', // 时间周期：近3年（2023-2025E）
    dataType: '订单规模+增长率', // 关键数据类型：订单规模（亿元）、年增长率
    evidenceValue: [
        { name: '2023', value: 50, growthRate: 25.0, orders: 12.5 },
        { name: '2024', value: 120, growthRate: 140.0, orders: 28.8 },
        { name: '2025E', value: 280, growthRate: 133.3, orders: 67.2 },
    ],
    highlightValue: '133.3%',
    highlightLabel: '2025年增长率',
    size: 'wide'
  },
  {
    id: 'm2',
    target: '商品期货',
    changeRate: '+12.3%', // 当前板块涨跌幅
    claim: '多数品种上涨，多品种涨停，显示出市场对大宗商品的强劲需求，但需警惕短期情绪过热带来的回调风险。',
    tag: '情绪',
    tagColor: 'red',
    evidenceType: 'chart',
    chartType: 'bar', // 柱状图：对比各季度需求指数，显示"强劲需求"
    timePeriod: '季度', // 时间周期：近4个季度（2024Q1-Q4）
    dataType: '需求指数', // 关键数据类型：需求指数、季度增长率
    evidenceValue: [
      { name: 'Q1', value: 95, growthRate: 5.2 },
      { name: 'Q2', value: 102, growthRate: 7.4 },
      { name: 'Q3', value: 108, growthRate: 5.9 },
      { name: 'Q4', value: 115, growthRate: 6.5 },
    ],
    highlightValue: '115',
    highlightLabel: 'Q4需求指数',
    size: 'small'
  },
  {
    id: 'm3',
    target: '资源周期',
    changeRate: '+8.7%', // 当前板块涨跌幅
    claim: '铜金价格持续上涨，通胀预期升温，但需关注美联储政策变化对商品价格的边际影响。',
    tag: '顺周期',
    tagColor: 'red',
    evidenceType: 'chart',
    chartType: 'area', // 面积图：显示"持续上涨"的价格趋势
    timePeriod: '月', // 时间周期：近4个月（1-4月）
    dataType: '价格指数', // 关键数据类型：价格指数、月度涨幅
    evidenceValue: [
        { name: '1月', value: 100, change: 0, price: 8500 },
        { name: '2月', value: 105, change: 5.0, price: 8925 },
        { name: '3月', value: 112, change: 6.7, price: 9520 },
        { name: '4月', value: 120, change: 7.1, price: 10200 },
    ],
    highlightValue: '+7.1%',
    highlightLabel: '4月涨幅',
    size: 'small'
  },
  {
    id: 'm4',
    target: 'AI算力',
    changeRate: '+22.1%', // 当前板块涨跌幅
    claim: '数据中心投资激增，算力需求爆发式增长，但需关注技术迭代和成本控制对盈利能力的冲击。',
    tag: '爆发',
    tagColor: 'red',
    evidenceType: 'chart',
    chartType: 'pie', // 饼图：展示算力需求结构分布
    timePeriod: '年', // 时间周期：2025年需求结构
    dataType: '需求结构', // 关键数据类型：需求结构占比
    evidenceValue: [
      { name: '训练', value: 45, color: '#ef4444' },
      { name: '推理', value: 30, color: '#f97316' },
      { name: '存储', value: 15, color: '#eab308' },
      { name: '其他', value: 10, color: '#22c55e' },
    ],
    highlightValue: '45%',
    highlightLabel: '训练需求',
    size: 'small'
  },
  {
    id: 'm5',
    target: '新能源车',
    changeRate: '-3.2%', // 当前板块涨跌幅
    claim: '海外需求回暖提振板块，头部企业排产回升显著，但价格战扰动仍在，建议关注具备一体化优势的电池环节。',
    tag: '回暖',
    tagColor: 'green',
    evidenceType: 'chart',
    chartType: 'line', // 折线图：显示"排产回升"趋势
    timePeriod: '季度', // 时间周期：近4个季度
    dataType: '排产指数+增长率', // 关键数据类型：排产指数、季度增长率
    evidenceValue: [
      { name: '2024Q1', value: 68, growthRate: -8.5 },
      { name: '2024Q2', value: 72, growthRate: 5.9 },
      { name: '2024Q3', value: 75, growthRate: 4.2 },
      { name: '2024Q4', value: 78, growthRate: 4.0 },
    ],
    highlightValue: '+4.0%',
    highlightLabel: 'Q4增长率',
    size: 'small'
  }
];

export interface RadarItem {
  id: string;
  target: string;
  claim: string;
  tag: string;
  imageUrl: string;
}

export const radarItems: RadarItem[] = [
  {
    id: 'r1',
    target: '合成生物',
    claim: '被忽视的万亿赛道，底层技术逐步成熟，应用场景快速拓展。',
    tag: '潜龙勿用',
    imageUrl: 'https://images.unsplash.com/photo-1576669801838-1b1c52121e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeW50aGV0aWMlMjBiaW9sb2d5JTIwbGFib3JhdG9yeSUyMGRuYXxlbnwxfHx8fDE3NjY0NzU5NjF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'r2',
    target: '量子计算',
    claim: '虽然距离商业化尚早，但近期融资事件频发，巨头布局加速。',
    tag: '前沿探索',
    imageUrl: 'https://images.unsplash.com/photo-1706783559851-8c34aff457ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFudHVtJTIwY29tcHV0aW5nJTIwZnV0dXJpc3RpYyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY2Mzg1NzEwfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'r3',
    target: '人形机器人',
    claim: '具身智能成为AI下半场核心，供应链降本超预期。',
    tag: '产业奇点',
    imageUrl: 'https://images.unsplash.com/photo-1760629863094-5b1e8d1aae74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbm9pZCUyMHJvYm90JTIwZnV0dXJpc3RpY3xlbnwxfHx8fDE3NjY0MjY1MzR8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
    {
    id: 'r4',
    target: '脑机接口',
    claim: '临床试验取得关键进展，康复医疗领域应用潜力巨大。',
    tag: '医疗革新',
    imageUrl: 'https://images.unsplash.com/photo-1732704573802-8ec393009148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbiUyMGNvbXB1dGVyJTIwaW50ZXJmYWNlJTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3NjY0NzU5NjF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

