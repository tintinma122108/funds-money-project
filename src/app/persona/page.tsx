'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { designTokens } from '@/styles/design-tokens';

type EvidenceType = 'news' | 'metric' | 'chart';
type SlotSize = 'wide' | 'small';

type IntelCard = {
  id: string;
  symbol: string;
  claim: string;
  evidenceType: EvidenceType;
  evidence: {
    headline?: string;
    source?: string;
    time?: string;
    metricLabel?: string;
    metricValue?: string;
    delta?: string;
    chartHint?: string;
    imageUrl?: string;
  };
  tag: string;
  sentiment: 'warning' | 'error' | 'success' | 'info';
  size: SlotSize;
};

const tokens = designTokens;

const indexCards = [
  {
    id: 'sh',
    name: 'A股 · 沪深300',
    level: '3,842.2',
    change: '+1.23%',
    tag: '成交放量',
    spark: [12, 14, 13, 15, 16, 18],
    summary:
      '新能源回暖，券商领涨。地产链拉升带动风险偏好抬升，需关注后续成交能否持续。',
    highlights: ['新能源', '券商', '地产'],
  },
  {
    id: 'hk',
    name: '恒生科技',
    level: '4,237.9',
    change: '-0.42%',
    tag: '波动放大',
    spark: [18, 17, 18, 16, 15, 15],
    summary:
      'AI 及互联网获利回吐，科网股分化。美债收益率回落，关注中概反弹窗口。',
    highlights: ['AI', '互联网'],
  },
  {
    id: 'us',
    name: '纳斯达克100',
    level: '18,522.6',
    change: '+0.34%',
    tag: '创新高',
    spark: [15, 16, 17, 17, 18, 19],
    summary:
      '大型科技财报季临近，市场定价软着陆。需关注盈利兑现与指导区间。',
    highlights: ['科技', '盈利'],
  },
];

const focusIntelStatic: IntelCard[] = [
  {
    id: 'f1',
    symbol: 'TSLA',
    claim: '交付预期下修，情绪承压但估值已快速消化。',
    evidenceType: 'metric',
    evidence: {
      metricLabel: '24E PE',
      metricValue: '43x',
      delta: '-12.4% WoW',
      chartHint: '交付与毛利率 3M 趋势',
    },
    tag: '估值回落',
    sentiment: 'warning',
    size: 'wide',
  },
  {
    id: 'f2',
    symbol: '贵州茅台',
    claim: '批价企稳，渠道动销回暖，旺季前补库存信号。',
    evidenceType: 'news',
    evidence: {
      headline: '春节前核心单品批价回升至 2900 元',
      source: '财联社',
      time: '2h ago',
      imageUrl:
        'https://images.unsplash.com/photo-1544465544-1b71aee9dfa6?auto=format&fit=crop&w=400&q=80',
    },
    tag: '需求修复',
    sentiment: 'success',
    size: 'small',
  },
  {
    id: 'f3',
    symbol: 'NVDA',
    claim: '数据中心订单延伸至 2H25，供给仍偏紧。',
    evidenceType: 'chart',
    evidence: {
      chartHint: '订单能见度 & 产能利用率',
      metricLabel: 'Book-to-bill',
      metricValue: '1.3x',
      delta: '+0.1 QoQ',
    },
    tag: '供给紧张',
    sentiment: 'info',
    size: 'small',
  },
];

const marketIntelStatic: IntelCard[] = [
  {
    id: 'm1',
    symbol: 'WTI',
    claim: '中东紧张推升风险溢价，油价上破区间。',
    evidenceType: 'chart',
    evidence: {
      chartHint: 'WTI 30D 价格 + 期权隐含波动',
      metricLabel: 'Last',
      metricValue: '$83.4',
      delta: '+2.1%',
    },
    tag: '波动放大',
    sentiment: 'warning',
    size: 'wide',
  },
  {
    id: 'm2',
    symbol: 'EURUSD',
    claim: '欧洲通胀超预期，降息预期后移，欧元反弹。',
    evidenceType: 'news',
    evidence: {
      headline: '欧元区核心通胀 3.5% 超预期',
      source: 'Bloomberg',
      time: 'Today',
      imageUrl:
        'https://images.unsplash.com/photo-1505664063602-92a5ee7f0e55?auto=format&fit=crop&w=400&q=80',
    },
    tag: '宏观偏好',
    sentiment: 'info',
    size: 'small',
  },
  {
    id: 'm3',
    symbol: '比特币',
    claim: 'ETF 申购净流入放缓，价格高位震荡。',
    evidenceType: 'metric',
    evidence: {
      metricLabel: '近7日净流入',
      metricValue: '$310M',
      delta: '-28% WoW',
      chartHint: 'ETF 净流入 & 价格',
    },
    tag: '情绪降温',
    sentiment: 'warning',
    size: 'small',
  },
];

const radarIntelStatic: IntelCard[] = [
  {
    id: 'r1',
    symbol: 'SMR 产业链',
    claim: '小型模块核电审批进度加速，设备订单有望释放。',
    evidenceType: 'news',
    evidence: {
      headline: '多地新核准项目启动招标',
      source: '路透',
      time: '1d ago',
    },
    tag: '新赛道',
    sentiment: 'info',
    size: 'wide',
  },
  {
    id: 'r2',
    symbol: '航运 (集运)',
    claim: '红海扰动叠加旺季，运价保持高位。',
    evidenceType: 'metric',
    evidence: {
      metricLabel: 'SCFI',
      metricValue: '3,230',
      delta: '+7.8% WoW',
    },
    tag: '高景气',
    sentiment: 'success',
    size: 'wide',
  },
  {
    id: 'r3',
    symbol: '黄金',
    claim: '实际利率回落，央行购金支撑，金价守高位。',
    evidenceType: 'chart',
    evidence: {
      chartHint: '金价 vs 实际利率',
      metricLabel: 'Last',
      metricValue: '$2,320',
      delta: '+0.6%',
    },
    tag: '防御',
    sentiment: 'success',
    size: 'wide',
  },
];

export default function PersonaPage() {
  const [activeIndexId, setActiveIndexId] = useState(indexCards[0].id);
  const [activeSection, setActiveSection] = useState<'focus' | 'market' | 'radar'>('focus');
  const [focusData, setFocusData] = useState<IntelCard[]>(focusIntelStatic);
  const [marketData, setMarketData] = useState<IntelCard[]>(marketIntelStatic);
  const [radarList, setRadarList] = useState<IntelCard[]>(radarIntelStatic);
  const [toast, setToast] = useState<string | null>(null);

  const focusRef = useRef<HTMLDivElement | null>(null);
  const marketRef = useRef<HTMLDivElement | null>(null);
  const radarRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = useMemo(
    () => indexCards.find((card) => card.id === activeIndexId) ?? indexCards[0],
    [activeIndexId],
  );

  const totalIntel = focusData.length + marketData.length + radarList.length;

  const normalizeSlots = (items: IntelCard[]) => {
    const cloned = items.map((item) => ({ ...item }));
    const smalls = cloned.filter((c) => c.size === 'small');
    if (smalls.length % 2 !== 0) {
      const lastSmallIndex = cloned.map((c) => c.size === 'small').lastIndexOf(true);
      if (lastSmallIndex >= 0) {
        cloned[lastSmallIndex].size = 'wide';
      }
    }
    return cloned;
  };

  const focusSlots = useMemo(() => normalizeSlots(focusData), [focusData]);
  const marketSlots = useMemo(() => normalizeSlots(marketData), [marketData]);

  // 模拟/真实数据加载：如果存在 /api/persona/intel，可返回 { focus, market, radar }
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/persona/intel', { method: 'GET' });
        if (!res.ok) return;
        const json = (await res.json()) as {
          focus?: IntelCard[];
          market?: IntelCard[];
          radar?: IntelCard[];
        };
        if (cancelled) return;
        if (json.focus?.length) setFocusData(json.focus);
        if (json.market?.length) setMarketData(json.market);
        if (json.radar?.length) setRadarList(json.radar);
      } catch (e) {
        // ignore, fallback to static
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const sections = [
      { id: 'focus', ref: focusRef },
      { id: 'market', ref: marketRef },
      { id: 'radar', ref: radarRef },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
        if (visible[0]) {
          const id = visible[0].target.getAttribute('data-section-id');
          if (id === 'focus' || id === 'market' || id === 'radar') setActiveSection(id);
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0.15, 0.4, 0.75] },
    );

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: 'focus' | 'market' | 'radar') => {
    const map = { focus: focusRef, market: marketRef, radar: radarRef };
    const el = map[id].current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSwipe = (id: string, action: 'dismiss' | 'follow') => {
    if (action === 'dismiss') {
      setRadarList((prev) => prev.filter((item) => item.id !== id));
      setToast('已为你降低此类机会的推送频次');
    } else {
      setToast('将为你持续跟踪类似机会');
    }
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: tokens.colors.background.secondary, color: tokens.colors.text.primary }}
    >
      {/* Sticky anchor nav */}
      <nav className="sticky top-0 z-30 backdrop-blur-md bg-white/85 border-b border-[rgba(0,0,0,0.06)]">
        <div className="max-w-xl mx-auto w-full px-3 py-2 flex items-center gap-2">
          {[
            { id: 'focus', label: '你的关注和持仓', count: focusData.length },
            { id: 'market', label: '全市场情报', count: marketData.length },
            { id: 'radar', label: '拓阈雷达', count: radarList.length },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id as 'focus' | 'market' | 'radar')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium transition-transform ${
                activeSection === item.id
                  ? 'bg-[rgba(36,121,240,0.12)] text-[rgb(36,121,240)] shadow-sm'
                  : 'bg-white/60 text-gray-700 hover:translate-y-[-1px]'
              }`}
            >
              <span>{item.label}</span>
              <span className="px-2 py-1 rounded-full bg-white text-[12px] text-[rgb(26,100,221)] shadow-sm">
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Hero & Market Pulse */}
      <header
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(120deg, ${tokens.colors.primary.brand} 0%, ${tokens.colors.primary.blue} 60%, ${tokens.colors.primary.purple} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.8),transparent_35%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.7),transparent_30%)]" />
        <div className="max-w-xl mx-auto w-full px-3 pt-8 pb-5 relative z-10 text-white">
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-80 mb-2">Immersive Dashboard</p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">懂金融的私人投资助理</h1>
          <p className="text-sm md:text-base text-white/80">
            根据你的偏好与市场环境动态生成叙事式情报，先看宏观，再落到你的持仓与新机会，保持客观克制，帮你做出更有把握的长期决策。
          </p>
        </div>

        {/* Index carousel */}
        <div className="max-w-xl mx-auto w-full px-3 pb-5 relative z-10">
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
            {indexCards.map((card) => {
              const isActive = card.id === activeIndexId;
              return (
                <button
                  key={card.id}
                  onClick={() => setActiveIndexId(card.id)}
                  className={`flex-shrink-0 w-[78vw] md:w-72 p-4 rounded-2xl border transition-all text-left snap-start ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-lg border-white'
                      : 'bg-white/10 border-white/40 text-white/80'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-medium opacity-80">{card.name}</div>
                      <div
                        className="text-2xl font-semibold"
                        style={{ fontFamily: designTokens.typography.fontFamily.mono.join(',') }}
                      >
                        {card.level}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        card.change.startsWith('-') ? 'bg-white/10' : 'bg-white text-[rgb(19,194,113)]'
                      }`}
                    >
                      {card.change}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-black/20 text-white">
                      {card.tag}
                    </span>
                    <span className="text-[11px] opacity-70">·</span>
                    <span className="text-[11px] opacity-70">微盘中</span>
                  </div>
                  <div className="h-12 flex items-end gap-1">
                    {card.spark.map((v, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full"
                        style={{
                          height: `${v * 2}px`,
                          backgroundColor: isActive ? 'rgba(36,121,240,0.9)' : 'rgba(255,255,255,0.5)',
                        }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sliding summary */}
          <div className="mt-3 bg-white text-gray-900 rounded-2xl p-4 shadow-lg overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-700">今日市场脉搏</div>
              <div className="flex gap-2">
                {activeIndex.highlights.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-full text-xs"
                    style={{ backgroundColor: tokens.colors.primary['blue-10%'], color: tokens.colors.primary.blue }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative h-[72px]">
              <div
                key={activeIndex.id}
                className="absolute inset-0 transition-all duration-300 ease-out"
                style={{
                  transform: `translateX(${activeIndexId === activeIndex.id ? '0%' : '-6%'})`,
                  opacity: 1,
                }}
              >
                <p className="text-sm text-gray-700 leading-relaxed">
                  {activeIndex.summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Smart bridge */}
      <section
        className="border-b"
        style={{
          backgroundColor: tokens.colors.background.tertiary,
          borderColor: tokens.colors.border.secondary,
        }}
      >
        <div className="max-w-xl mx-auto w-full px-3 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-gray-800">智能承接</div>
              <p className="text-sm text-gray-600">
                基于上述宏观环境，今天你需要更关注以下 {totalIntel} 条情报。下拉查看重点。
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow-sm text-sm font-semibold text-gray-800">
              <span>情报总数</span>
              <span className="px-2 py-1 rounded-full" style={{ backgroundColor: tokens.colors.primary['blue-10%'], color: tokens.colors.primary.blue }}>
                {totalIntel}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Micro intelligence */}
      <main className="max-w-xl mx-auto w-full px-3 py-8 space-y-8">
        <div className="rounded-2xl bg-white shadow-lg p-4" id="focus" ref={focusRef} data-section-id="focus">
          <SectionHeader title="你的关注和持仓" count={focusData.length} description="与你持仓/自选最相关的异动、风险与机会。" />
          <BentoGrid items={focusSlots} />
        </div>

        <div className="rounded-2xl bg-white shadow-lg p-4" id="market" ref={marketRef} data-section-id="market">
          <SectionHeader title="全市场情报" count={marketData.length} description="AI 发现的池外机会与风险提醒。" />
          <BentoGrid items={marketSlots} />
        </div>

        <div className="rounded-2xl bg-white shadow-lg p-4" id="radar" ref={radarRef} data-section-id="radar">
          <SectionHeader title="拓阈雷达" count={radarList.length} description="不在你的偏好与对话轨迹内，但值得关注的新趋势。" />
          <div className="grid gap-4">
            {radarList.map((item) => (
              <IntelCard
                key={item.id}
                item={item}
                actions={
                  <div className="flex gap-2 text-xs">
                    <button
                      className="px-3 py-1 rounded-full bg-[rgba(207,34,69,0.08)] text-[rgb(207,34,69)] hover:translate-y-[-1px] transition-transform"
                      onClick={() => handleSwipe(item.id, 'dismiss')}
                    >
                      不再关心
                    </button>
                    <button
                      className="px-3 py-1 rounded-full bg-[rgba(36,121,240,0.08)] text-[rgb(36,121,240)] hover:translate-y-[-1px] transition-transform"
                      onClick={() => handleSwipe(item.id, 'follow')}
                    >
                      持续关心
                    </button>
                  </div>
                }
              />
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500">
            左滑：不再关心（移除并降低推荐）；右滑：持续关心（toast 提示后保留）。
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center px-4">
          <div className="px-4 py-3 rounded-full bg-[rgba(0,0,0,0.8)] text-white text-sm shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  title,
  description,
  count,
}: {
  title: string;
  description: string;
  count: number;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <div>
        <div className="text-lg font-semibold text-gray-900">{title}</div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[rgba(36,121,240,0.08)] text-[rgb(36,121,240)] text-sm font-semibold">
        <span>数量</span>
        <span className="px-2 py-1 rounded-full bg-white text-[rgb(26,100,221)] shadow-sm">{count}</span>
      </div>
    </div>
  );
}

function BentoGrid({ items }: { items: IntelCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`col-span-12 ${item.size === 'wide' ? 'md:col-span-12' : 'md:col-span-6'}`}
        >
          <IntelCard item={item} />
        </div>
      ))}
    </div>
  );
}

function IntelCard({ item, actions }: { item: IntelCard; actions?: React.ReactNode }) {
  const sentimentColor =
    item.sentiment === 'error'
      ? tokens.colors.semantic.error
      : item.sentiment === 'warning'
      ? tokens.colors.semantic.warning
      : item.sentiment === 'success'
      ? tokens.colors.semantic.success
      : tokens.colors.semantic.info;
  const swipe = useSwipe();

  return (
    <div
      className="h-full rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      ref={swipe.ref}
      style={{ transform: `translateX(${swipe.offset}px)`, transition: swipe.isDragging ? 'none' : 'transform 180ms ease' }}
      onPointerDown={swipe.onPointerDown}
      onPointerMove={swipe.onPointerMove}
      onPointerUp={swipe.onPointerUp}
      onPointerCancel={swipe.onPointerCancel}
      onTouchStart={swipe.onTouchStart}
      onTouchMove={swipe.onTouchMove}
      onTouchEnd={swipe.onTouchEnd}
      onTouchCancel={swipe.onTouchCancel}
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="text-base font-semibold text-gray-900">{item.symbol}</div>
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{ backgroundColor: `${sentimentColor}1a`, color: sentimentColor }}
          >
            {item.tag}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <span className="text-[11px] text-gray-500">优先级 · 客观分析</span>
        </div>
      </div>

      <div className="px-4 pt-2 pb-4 space-y-3">
        <p className="text-sm text-gray-800 leading-relaxed">{item.claim}</p>
        <EvidenceBlock item={item} />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>影响：关注交易节奏、风险与持仓权重</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sentimentColor }} />
            <span className="text-gray-600">态度</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 轻量手势 Hook：支持 pointer/touch 左右滑，暴露偏移值，用于卡片移动。
 * 用于触发不再关心/持续关心的反馈入口（当前偏移仅做表现，实际动作由按钮触发）。
 */
function useSwipe() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const start = (x: number) => {
    startX.current = x - offset;
    setIsDragging(true);
  };

  const move = (x: number) => {
    if (!isDragging) return;
    const next = x - startX.current;
    setOffset(Math.max(Math.min(next, 60), -60));
  };

  const end = () => {
    setIsDragging(false);
    setOffset((prev) => (Math.abs(prev) > 40 ? (prev > 0 ? 32 : -32) : 0));
  };

  return {
    ref,
    offset,
    isDragging,
    onPointerDown: (e: React.PointerEvent) => {
      ref.current?.setPointerCapture(e.pointerId);
      start(e.clientX);
    },
    onPointerMove: (e: React.PointerEvent) => move(e.clientX),
    onPointerUp: (e: React.PointerEvent) => {
      ref.current?.releasePointerCapture(e.pointerId);
      end();
    },
    onPointerCancel: () => end(),
    onTouchStart: (e: React.TouchEvent) => start(e.touches[0]?.clientX ?? 0),
    onTouchMove: (e: React.TouchEvent) => move(e.touches[0]?.clientX ?? 0),
    onTouchEnd: () => end(),
    onTouchCancel: () => end(),
  };
}
function EvidenceBlock({ item }: { item: IntelCard }) {
  if (item.evidenceType === 'news') {
    return (
      <div className="flex gap-3 p-3 rounded-xl bg-[rgba(0,0,0,0.02)]">
        {item.evidence.imageUrl ? (
          <div
            className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url(${item.evidence.imageUrl})` }}
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[rgba(36,121,240,0.15)] to-[rgba(0,175,188,0.15)]" />
        )}
        <div className="flex-1 space-y-1">
          <div className="text-sm font-semibold text-gray-900 line-clamp-2">{item.evidence.headline}</div>
          <div className="text-xs text-gray-500">
            {item.evidence.source} · {item.evidence.time}
          </div>
          <div className="text-[11px] text-gray-500">证据：新闻事件图片 / 来源可信度</div>
        </div>
      </div>
    );
  }

  if (item.evidenceType === 'metric') {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-[rgba(0,175,188,0.06)]">
        <div>
          <div className="text-xs text-gray-500">{item.evidence.metricLabel}</div>
          <div
            className="text-xl font-semibold text-gray-900"
            style={{ fontFamily: designTokens.typography.fontFamily.mono.join(',') }}
          >
            {item.evidence.metricValue}
          </div>
          <div className="text-xs text-[rgb(0,152,166)] font-medium">{item.evidence.delta}</div>
        </div>
        <div className="text-xs text-gray-500 text-right max-w-[160px]">
          证据：关键指标变化；可扩展为数值堆叠 + sparkline
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[rgba(179,47,231,0.06)]">
      <div className="col-span-2">
        <div className="text-xs text-gray-500">{item.evidence.metricLabel}</div>
        <div
          className="text-xl font-semibold text-gray-900"
          style={{ fontFamily: designTokens.typography.fontFamily.mono.join(',') }}
        >
          {item.evidence.metricValue}
        </div>
        <div className="text-xs text-[rgb(179,47,231)] font-medium">{item.evidence.delta}</div>
        <div className="text-[11px] text-gray-500 mt-1">证据：量化趋势 · 可用面积/折线图</div>
      </div>
      <div className="col-span-1">
        <div className="h-full rounded-lg bg-gradient-to-b from-[rgba(36,121,240,0.12)] to-[rgba(0,175,188,0.12)] flex items-center justify-center text-[11px] text-gray-600 text-center px-2">
          {item.evidence.chartHint || '趋势图占位'}
        </div>
      </div>
    </div>
  );
}


