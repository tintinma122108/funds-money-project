'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Mic } from 'lucide-react';

const haloImage = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=800&fit=crop";

const Tag = ({ children, color = "rose" }: { children: React.ReactNode, color?: "rose" | "emerald" | "blue" }) => {
    const colorStyles = {
        rose: "bg-rose-500/10 border-rose-500/20 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
        emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
        blue: "bg-blue-500/10 border-blue-500/20 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
    };
    
    return (
        <span className={`inline-flex items-center px-1.5 py-0 mx-1 rounded text-[15px] font-medium tracking-wide border backdrop-blur-sm align-baseline translate-y-[-1px] ${colorStyles[color]}`}>
            {children}
        </span>
    );
};

export const DailyBriefing = () => {
  const [activeSection, setActiveSection] = useState<'briefing' | 'micro_content'>('briefing');
  const [mounted, setMounted] = useState(false);
  const [microTab, setMicroTab] = useState<'focus' | 'market' | 'radar'>('focus');
  const [scrolled, setScrolled] = useState(false);
  const [focusedCardData, setFocusedCardData] = useState<{ target: string | null, tag: string | null, claim: string | null }>({ target: null, tag: null, claim: null });
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mounted && headerRef.current) {
      const updateHeight = () => {
        if (headerRef.current) {
          document.documentElement.style.setProperty('--header-height', `${headerRef.current.offsetHeight}px`);
        }
      };
      const observer = new ResizeObserver(updateHeight);
      observer.observe(headerRef.current);
      return () => observer.disconnect();
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      const microRoot = document.getElementById('micro-intelligence-root');
      if (microRoot) {
        const rect = microRoot.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          setActiveSection('micro_content');
        } else {
          setActiveSection('briefing');
        }
      } else {
        if (scrollY < window.innerHeight * 0.9) {
          setActiveSection('briefing');
        } else {
          setActiveSection('micro_content');
        }
      }
    };

    const handleMicroTabChange = (e: any) => {
      setMicroTab(e.detail.tab);
    };

    const handleCardFocus = (e: any) => {
        setFocusedCardData({
            target: e.detail.target,
            tag: e.detail.tag,
            claim: e.detail.claim
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('micro-tab-change', handleMicroTabChange);
    window.addEventListener('micro-card-focus', handleCardFocus);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('micro-tab-change', handleMicroTabChange);
      window.removeEventListener('micro-card-focus', handleCardFocus);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('briefing-section-change', { detail: { section: activeSection } }));
  }, [activeSection]);

  const getContent = () => {
    if (activeSection === 'briefing') {
      return {
        mainTitle: "早安Alex",
        subTitle: "今日需要你关注5条情报",
        body: (
          <div className="text-left">
            <p className="leading-relaxed">
              今日全球市场<Tag color="rose">呈现分化走势</Tag>，美股整体下跌（标普500跌0.3%，道指跌0.9%），但纳斯达克微涨0.2%。A股实现13连阳创牛市新高，市场热度持续。整体而言，市场环境对您的投资组合<Tag color="emerald">保持中性偏积极</Tag>，建议关注政策言论对特定行业的影响，以及A股连续上涨后的技术性调整风险。
            </p>
          </div>
        )
      };
    }

    let mainTitle = "";
    let subTitleText = "";
    let bodyText: React.ReactNode = "";

    switch (microTab) {
      case 'focus':
        mainTitle = "你的持仓与自选";
        break;
      case 'market':
        mainTitle = "市场增量机会";
        break;
      case 'radar':
        mainTitle = "拓域机会";
        break;
    }

    let displayTarget = focusedCardData.target;
    let displayTag = focusedCardData.tag;

    if (!displayTarget || !displayTag) {
        if (microTab === 'focus') { displayTarget = "半导体设备"; displayTag = "景气回升"; }
        else if (microTab === 'market') { displayTarget = "低空经济"; displayTag = "政策驱动"; }
        else { displayTarget = "合成生物"; displayTag = "潜龙勿用"; }
    }

    subTitleText = `${displayTarget} ${displayTag}`;

    const getBodyContent = (target: string | null) => {
        switch (target) {
            case "半导体设备":
                return (
                    <div className="text-left">
                        <p className="leading-relaxed">
                            行业景气度持续回升，ETF表现突出，但需关注后续订单的持续性。当前估值已反映部分乐观预期，建议关注具备技术壁垒和客户粘性的龙头企业，<Tag color="emerald">审慎评估</Tag>短期波动风险。
                        </p>
                    </div>
                );
            case "新能源车":
                return (
                    <div className="text-left">
                        <p className="leading-relaxed">
                            该板块受<Tag color="emerald">海外需求</Tag>回暖提振，头部企业<Tag color="emerald">排产回升</Tag>显著。虽然当前面临<Tag color="emerald">价格战</Tag>扰动，但<Tag color="emerald">一体化优势</Tag>确立了长期壁垒，建议关注<Tag color="emerald">电池环节</Tag>的估值修复机会。
                        </p>
                    </div>
                );
            case "低空经济":
                return (
                    <div className="text-left">
                        <p className="leading-relaxed">
                            作为<Tag color="emerald">新质生产力</Tag>典型代表，该领域近期频获<Tag color="emerald">政策加码</Tag>。目前处于<Tag color="emerald">基础设施</Tag>建设期，订单释放具有<Tag color="emerald">确定性</Tag>，但商业化落地仍需时间验证。建议重点跟踪<Tag color="emerald">空管系统</Tag>核心供应商，<Tag color="emerald">保持耐心</Tag>等待业绩兑现。
                        </p>
                    </div>
                );
            case "合成生物":
                return (
                    <div className="text-left">
                        <p className="leading-relaxed">
                            行业正处于<Tag color="emerald">技术奇点</Tag>爆发前夜，多款产品实现<Tag color="emerald">商业化落地</Tag>。尽管短期受<Tag color="emerald">研发投入</Tag>影响利润承压，但<Tag color="emerald">选品能力</Tag>将决定<Tag color="emerald">成长上限</Tag>，看好平台型龙头。
                        </p>
                    </div>
                );
            default:
                return (
                   <div className="text-left">
                      <p className="leading-relaxed">
                        系统监测发现，该细分领域当前具备较高的
                        <Tag color="emerald">赔率空间</Tag>
                        ，主力资金呈现
                        <Tag color="emerald">持续抢筹</Tag>
                        态势。虽然短期存在
                        <Tag color="emerald">获利盘消化</Tag>
                        压力，但
                        <Tag color="emerald">中期趋势</Tag>
                        已确立，建议择机布局以博取
                        <Tag color="emerald">超额收益</Tag>
                        。
                      </p>
                   </div>
                );
        }
    };

    bodyText = getBodyContent(displayTarget);

    return {
      mainTitle,
      subTitle: subTitleText,
      body: bodyText
    };
  };

  const current = getContent();

  const portalTarget = typeof document !== 'undefined' ? document.getElementById('iphone-screen') : null;

  return (
    <div className="relative w-full min-h-[320px]">
      {mounted && createPortal(
        <div 
          ref={headerRef}
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[375px] max-w-[375px] px-4 z-[100] flex flex-col items-center justify-start pt-16 pb-12 pointer-events-none"
        >
          <div 
            className="absolute inset-0 -z-20 overflow-hidden pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
            }}
          >
             <motion.div 
               className="absolute inset-0"
               style={{
                 background: 'linear-gradient(to bottom, #000000 90%, rgba(0,0,0,0) 100%)',
                 maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)'
               }}
               animate={{ opacity: (activeSection === 'briefing' && !scrolled) ? 0 : 1 }}
               transition={{ duration: 0.5 }}
             />

             <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                    className="absolute w-[800px] h-[800px] -top-[220px]"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                 >
                    <motion.img 
                      src={haloImage} 
                      alt="AI Halo" 
                      className="w-full h-full object-contain mix-blend-screen blur-xl"
                      animate={{ 
                        rotate: [0, 360],
                      }}
                      transition={{ 
                        duration: 60, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                    />
                 </motion.div>
             </div>
             
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none" />
          </div>

          <div className="w-full max-w-[375px] mx-auto px-4 pointer-events-auto relative">
            
            <AnimatePresence mode="wait">
                <motion.div 
                    key={`${activeSection}-${activeSection === 'micro_content' ? microTab : ''}-${focusedCardData.target}`}
                    initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full"
                >
                    <div className="flex flex-col mb-6">
                      <div className="flex items-center justify-between mb-2 min-h-[32px]">
                          <motion.h1 
                            className="font-serif text-white/50 text-sm tracking-widest uppercase text-left whitespace-nowrap overflow-hidden text-ellipsis"
                          >
                            {current.mainTitle}
                          </motion.h1>
                      </div>

                      <h2
                          className="font-serif text-white text-2xl tracking-wide text-left drop-shadow-2xl leading-tight"
                      >
                          {current.subTitle.split("").map((char, i) => (
                              <motion.span
                                  key={i}
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: "auto" }}
                                  transition={{
                                      duration: 0.01,
                                      delay: i * 0.08,
                                      ease: "linear"
                                  }}
                                  className="inline-block whitespace-pre overflow-hidden vertical-bottom"
                              >
                                  {char}
                              </motion.span>
                          ))}
                      </h2>
                    </div>
                    
                    <motion.div 
                        className="text-[16px] font-serif leading-[1.6] font-light tracking-wide text-zinc-300 drop-shadow-md text-left"
                    >
                      {current.body}
                    </motion.div>
                </motion.div>
            </AnimatePresence>
          </div>
        </div>,
        portalTarget || document.body
      )}
    </div>
  );
};

